(() => {
    "use strict";

    const STORAGE_KEY = "savedAccounts";
    const LAST_USED_KEY = "lastUsedEmail";
    const PAGE_SIZE = 4;
    const mountedForms = new WeakSet();

    function readAccounts() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(value)) return [];
            return value
                .filter(account => account && typeof account.email === "string")
                .map(account => ({
                    email: account.email,
                    password: typeof account.password === "string" ? account.password : "",
                    lastUsed: Number(account.lastUsed) || 0
                }))
                .sort((a, b) => b.lastUsed - a.lastUsed);
        } catch {
            return [];
        }
    }

    function writeAccounts(accounts) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(accounts.slice().sort((a, b) => b.lastUsed - a.lastUsed))
        );
    }

    function setReactInputValue(input, value) {
        if (!input) return;
        const descriptor = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
        );
        if (descriptor && descriptor.set) {
            descriptor.set.call(input, value);
        } else {
            input.value = value;
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function makeButton(text, className) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = text;
        return button;
    }

    function resolveInputs(form) {
        const inputs = Array.from(form.querySelectorAll("input"));
        const password = inputs.find(input =>
            input.type === "password" ||
            /password/i.test(input.id || "") ||
            Boolean(input.closest(".ant-input-password"))
        );
        const email = inputs.find(input =>
            input !== password &&
            (/email/i.test(input.id || "") || input.type === "email")
        ) || inputs.find(input =>
            input !== password &&
            (input.type === "text" || !input.type)
        );
        return { email, password };
    }

    function findLoginForms() {
        return Array.from(document.querySelectorAll("form")).filter(form => {
            if (!form.closest('[class*="Login_loginFormBox__"]')) return false;
            const { email, password } = resolveInputs(form);
            return Boolean(email && password);
        });
    }

    function mount(form) {
        if (mountedForms.has(form)) return;

        const { email, password } = resolveInputs(form);
        if (!email || !password) return;
        mountedForms.add(form);

        const panel = document.createElement("section");
        panel.className = "rf-account-manager";
        panel.setAttribute("aria-label", "已儲存帳號");

        const toolbar = document.createElement("div");
        toolbar.className = "rf-account-toolbar";

        const title = document.createElement("strong");
        title.className = "rf-account-title";
        title.textContent = "快速選擇帳號";

        const rememberLabel = document.createElement("label");
        rememberLabel.className = "rf-account-remember";

        const remember = document.createElement("input");
        remember.type = "checkbox";
        remember.name = "rfRememberAccount";

        const rememberText = document.createElement("span");
        rememberText.textContent = "記住帳號";

        rememberLabel.append(remember, rememberText);
        toolbar.append(title, rememberLabel);

        const list = document.createElement("div");
        list.className = "rf-account-list";

        const pager = document.createElement("div");
        pager.className = "rf-account-pager";

        panel.append(toolbar, list, pager);
        form.appendChild(panel);

        let currentPage = 0;

        function selectAccount(account) {
            setReactInputValue(email, account.email);
            setReactInputValue(password, account.password || "");
            remember.checked = true;
            localStorage.setItem(LAST_USED_KEY, account.email);
        }

        function removeAccount(accountEmail) {
            const accounts = readAccounts().filter(
                account => account.email !== accountEmail
            );
            writeAccounts(accounts);

            if (localStorage.getItem(LAST_USED_KEY) === accountEmail) {
                if (accounts.length) {
                    localStorage.setItem(LAST_USED_KEY, accounts[0].email);
                } else {
                    localStorage.removeItem(LAST_USED_KEY);
                }
            }

            currentPage = Math.min(
                currentPage,
                Math.max(1, Math.ceil(accounts.length / PAGE_SIZE)) - 1
            );
            render();
        }

        function render() {
            const accounts = readAccounts();
            const totalPages = Math.max(1, Math.ceil(accounts.length / PAGE_SIZE));
            currentPage = Math.min(currentPage, totalPages - 1);

            list.replaceChildren();
            pager.replaceChildren();

            if (!accounts.length) {
                const empty = document.createElement("div");
                empty.className = "rf-account-empty";
                empty.textContent = "尚未儲存帳號";
                list.appendChild(empty);
                return;
            }

            const start = currentPage * PAGE_SIZE;
            for (const account of accounts.slice(start, start + PAGE_SIZE)) {
                const row = document.createElement("div");
                row.className = "rf-account-row";

                const select = makeButton(account.email, "rf-account-select");
                select.title = account.email;
                select.addEventListener("click", () => selectAccount(account));

                const remove = makeButton("刪除", "rf-account-delete");
                remove.setAttribute("aria-label", `刪除 ${account.email}`);
                remove.addEventListener("click", () => removeAccount(account.email));

                row.append(select, remove);
                list.appendChild(row);
            }

            if (totalPages > 1) {
                const previous = makeButton("◀", "rf-account-page-button");
                previous.disabled = currentPage === 0;
                previous.addEventListener("click", () => {
                    if (currentPage > 0) {
                        currentPage -= 1;
                        render();
                    }
                });

                const status = document.createElement("span");
                status.className = "rf-account-page-status";
                status.textContent = `${currentPage + 1} / ${totalPages}`;

                const next = makeButton("▶", "rf-account-page-button");
                next.disabled = currentPage >= totalPages - 1;
                next.addEventListener("click", () => {
                    if (currentPage < totalPages - 1) {
                        currentPage += 1;
                        render();
                    }
                });

                pager.append(previous, status, next);
            }
        }

        function persistCurrentAccount() {
            const accountEmail = email.value.trim();
            const accountPassword = password.value;
            if (!accountEmail) return;

            let accounts = readAccounts();

            if (remember.checked && accountPassword) {
                const record = {
                    email: accountEmail,
                    password: accountPassword,
                    lastUsed: Date.now()
                };
                const index = accounts.findIndex(
                    account => account.email === accountEmail
                );
                if (index >= 0) {
                    accounts[index] = record;
                } else {
                    accounts.push(record);
                }
                writeAccounts(accounts);
                localStorage.setItem(LAST_USED_KEY, accountEmail);
            } else if (!remember.checked) {
                accounts = accounts.filter(
                    account => account.email !== accountEmail
                );
                writeAccounts(accounts);
                if (localStorage.getItem(LAST_USED_KEY) === accountEmail) {
                    if (accounts.length) {
                        localStorage.setItem(LAST_USED_KEY, accounts[0].email);
                    } else {
                        localStorage.removeItem(LAST_USED_KEY);
                    }
                }
            }

            render();
        }

        form.addEventListener("submit", persistCurrentAccount, true);

        const loginBox = form.closest('[class*="Login_loginFormBox__"]');
        if (loginBox) {
            loginBox.addEventListener("click", event => {
                const confirmButton = event.target.closest(
                    '[class*="Login_formBtn__"].ClickEffect'
                );
                if (confirmButton && loginBox.contains(confirmButton)) {
                    persistCurrentAccount();
                }
            }, true);
        }

        email.addEventListener("change", () => {
            const account = readAccounts().find(
                item => item.email === email.value.trim()
            );
            if (account) {
                setReactInputValue(password, account.password || "");
                remember.checked = true;
            }
        });

        render();

        const lastUsedEmail = localStorage.getItem(LAST_USED_KEY);
        const lastAccount = readAccounts().find(
            account => account.email === lastUsedEmail
        );
        if (lastAccount) {
            queueMicrotask(() => selectAccount(lastAccount));
        }
    }

    function scan() {
        findLoginForms().forEach(mount);
    }

    function start() {
        scan();
        const observer = new MutationObserver(scan);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
