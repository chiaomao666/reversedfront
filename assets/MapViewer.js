/**
 * MapViewer.js - 擬真 Leaflet 結構原生圖磚渲染模組
 */
export class MapViewer {
    constructor(rootElement, options = {}) {
        if (!rootElement) throw new Error('必須提供 rootElement 掛載點');
        
        this.root = rootElement;
        
        // 根據截圖，預設改為 tiles/{z}/{x}/{y}.png
        this.tileSize = options.tileSize || 256;
        this.urlTemplate = options.urlTemplate || 'tiles/{z}/{x}/{y}.png';
        
        this.z = options.z || 4;
        this.minX = options.minX || 4;
        this.maxX = options.maxX || 8;
        this.minY = options.minY || 3;
        this.maxY = options.maxY || 6;

        this.scale = options.initialScale || 1;
        this.posX = 0;
        this.posY = 0;
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.ticking = false;

        this.initDOM();
        this.initMap();
        this.initEvents();
    }

    initDOM() {
        // 清空根節點並加上截圖中的 root class
        this.root.innerHTML = '';
        this.root.className = 'Map_rootContainer__ePWvy iMapZoom_' + this.z;

        // 生成 Map Container
        this.mapContainer = document.createElement('div');
        this.mapContainer.className = 'Map_mapContainer__Auvit leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom';
        this.mapContainer.tabIndex = 0;

        // 生成 Map Pane (負責拖曳平移 translate3d)
        this.mapPane = document.createElement('div');
        this.mapPane.className = 'leaflet-pane leaflet-map-pane';

        // 生成 Tile Pane
        const tilePane = document.createElement('div');
        tilePane.className = 'leaflet-pane leaflet-tile-pane';

        // 生成 Layer
        const layer = document.createElement('div');
        layer.className = 'leaflet-layer ';
        layer.style.zIndex = 1;
        layer.style.opacity = 1;

        // 生成 Tile Container (負責縮放 scale)
        this.tileContainer = document.createElement('div');
        this.tileContainer.className = 'leaflet-tile-container leaflet-zoom-animated';
        this.tileContainer.style.zIndex = 18; // 對應截圖最上層的圖磚容器

        // 依序組裝 DOM 樹
        layer.appendChild(this.tileContainer);
        tilePane.appendChild(layer);
        this.mapPane.appendChild(tilePane);
        
        // 生成 Overlay Pane (預留給未來擴充)
        const overlayPane = document.createElement('div');
        overlayPane.className = 'leaflet-pane leaflet-overlay-pane';
        this.mapPane.appendChild(overlayPane);

        this.mapContainer.appendChild(this.mapPane);
        this.root.appendChild(this.mapContainer);
    }

    initMap() {
        const cols = this.maxX - this.minX + 1;
        const rows = this.maxY - this.minY + 1;
        this.mapWidth = cols * this.tileSize;
        this.mapHeight = rows * this.tileSize;

        const fragment = document.createDocumentFragment();

        for (let x = this.minX; x <= this.maxX; x++) {
            for (let y = this.minY; y <= this.maxY; y++) {
                const img = document.createElement('img');
                img.alt = '';
                
                // 動態替換網址
                img.src = this.urlTemplate
                    .replace('{z}', this.z)
                    .replace('{x}', x)
                    .replace('{y}', y);
                
                img.className = 'leaflet-tile leaflet-tile-loaded';
                
                // 完全還原截圖的 inline style 定位方式 (translate3d)
                const offsetX = (x - this.minX) * this.tileSize;
                const offsetY = (y - this.minY) * this.tileSize;
                
                img.style.width = `${this.tileSize}px`;
                img.style.height = `${this.tileSize}px`;
                img.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0px)`;
                img.style.opacity = 1;
                
                img.onerror = () => { img.style.display = 'none'; };

                fragment.appendChild(img);
            }
        }
        
        this.tileContainer.appendChild(fragment);
        this.updateTransform();
    }

    initEvents() {
        // 滑鼠按下 (開始拖曳)
        this.mapContainer.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.posX;
            this.startY = e.clientY - this.posY;
        });

        // 滑鼠放開
        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // 拖曳平移 (節流優化)
        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const targetX = e.clientX - this.startX;
            const targetY = e.clientY - this.startY;

            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.posX = targetX;
                    this.posY = targetY;
                    this.constrainBounds();
                    this.updateTransform();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });

        // 滾輪縮放 (以游標為中心)
        this.mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const zoomIntensity = 0.1;
            const direction = e.deltaY < 0 ? 1 : -1;
            const zoomFactor = Math.exp(direction * zoomIntensity);
            
            const newScale = Math.min(Math.max(this.scale * zoomFactor, 0.2), 3);
            if (newScale === this.scale) return;

            const rect = this.mapContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.posX -= (mouseX - this.posX) * (newScale / this.scale - 1);
            this.posY -= (mouseY - this.posY) * (newScale / this.scale - 1);
            
            this.scale = newScale;
            this.constrainBounds();
            this.updateTransform();
        }, { passive: false });
    }

    constrainBounds() {
        const viewportWidth = this.mapContainer.clientWidth;
        const viewportHeight = this.mapContainer.clientHeight;
        
        const currentMapWidth = this.mapWidth * this.scale;
        const currentMapHeight = this.mapHeight * this.scale;

        const minX = viewportWidth > currentMapWidth ? (viewportWidth - currentMapWidth) / 2 : viewportWidth - currentMapWidth;
        const maxX = viewportWidth > currentMapWidth ? (viewportWidth - currentMapWidth) / 2 : 0;
        
        const minY = viewportHeight > currentMapHeight ? (viewportHeight - currentMapHeight) / 2 : viewportHeight - currentMapHeight;
        const maxY = viewportHeight > currentMapHeight ? (viewportHeight - currentMapHeight) / 2 : 0;

        this.posX = Math.min(Math.max(this.posX, minX), maxX);
        this.posY = Math.min(Math.max(this.posY, minY), maxY);
    }

    updateTransform() {
        // 將平移交給 mapPane，將縮放交給 tileContainer，完美吻合截圖結構
        this.mapPane.style.transform = `translate3d(${this.posX}px, ${this.posY}px, 0px)`;
        this.tileContainer.style.transform = `translate3d(0px, 0px, 0px) scale(${this.scale})`;
    }
}