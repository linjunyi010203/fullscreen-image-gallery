// --- 3D 立方体主逻辑 ---
const faceData = [
  {
    title: '驾驶舱入口',
    color: '#1976d2',
    html: `
      <div class="face-card">
        <div class="card" onclick="alert('资产总览页')">
          <i class="fas fa-chart-pie"></i>
          <span>资产总览页</span>
        </div>
        <div class="card" onclick="alert('治理落标页')">
          <i class="fas fa-bullseye"></i>
          <span>治理落标页</span>
        </div>
        <div class="card" onclick="alert('数据质量监控')">
          <i class="fas fa-shield-alt"></i>
          <span>数据质量监控</span>
        </div>
        <div class="card" onclick="alert('门户运营监控')">
          <i class="fas fa-desktop"></i>
          <span>门户运营监控</span>
        </div>
      </div>
      <div class="face-tip">点击卡片进入可视化页面</div>
    `
  },
  {
    title: '数据中台',
    color: '#42a5f5',
    html: `
      <div class="face-btns">
        <button class="face-btn" onclick="alert('数据中台介绍')"><i class="fas fa-info-circle"></i> 数据中台介绍</button>
        <button class="face-btn" onclick="alert('数据源监测')"><i class="fas fa-database"></i> 数据源监测</button>
        <button class="face-btn" onclick="alert('规范手册管理')"><i class="fas fa-book"></i> 规范手册管理</button>
      </div>
    `
  },
  {
    title: '数据服务',
    color: '#7e57c2',
    html: `
      <ul class="face-list">
        <li onclick="alert('数据资产目录')"><i class="fas fa-folder-tree"></i> 数据资产目录</li>
        <li onclick="alert('数据集管理')"><i class="fas fa-database"></i> 数据集管理</li>
      </ul>
    `
  },
  {
    title: '指标服务',
    color: '#00bcd4',
    html: `
      <div class="face-indicator" onclick="alert('指标管理')">
        <i class="fas fa-chart-line"></i>
        <span>指标管理</span>
      </div>
    `
  },
  {
    title: '规则服务',
    color: '#ff7043',
    html: `
      <div class="face-flow">
        <div class="flow-card" onclick="alert('规则开发')"><i class="fas fa-code"></i> 规则开发</div>
        <span class="arrow">→</span>
        <div class="flow-card" onclick="alert('规则封装')"><i class="fas fa-box"></i> 规则封装</div>
        <span class="arrow">→</span>
        <div class="flow-card" onclick="alert('规则服务')"><i class="fas fa-plug"></i> 规则服务</div>
      </div>
    `
  },
  {
    title: '知识服务',
    color: '#26a69a',
    html: `
      <div class="face-graph" onclick="alert('知识图谱查询')">
        <div class="node main"><i class="fas fa-project-diagram"></i></div>
        <div class="node sub" style="top:20px;left:120px;"></div>
        <div class="node sub" style="top:120px;left:60px;"></div>
        <div class="node sub" style="top:80px;left:160px;"></div>
        <span class="face-graph-tip">知识图谱查询</span>
      </div>
    `
  }
];

// 创建每一面材质
function createFaceMaterial(face) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  // 背景
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 512, 512);
  // 渐变条
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, face.color);
  grad.addColorStop(1, '#e3f2fd');
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.18;
  ctx.fillRect(0, 0, 512, 512);
  ctx.globalAlpha = 1;
  // 标题
  ctx.font = 'bold 36px Noto Sans SC';
  ctx.fillStyle = face.color;
  ctx.textAlign = 'center';
  ctx.fillText(face.title, 256, 60);
  // 用 DOM2Canvas 方式渲染HTML内容
  // 这里只做简单提示，实际可用 html2canvas 或直接用 overlay div
  return new THREE.MeshPhongMaterial({ map: new THREE.CanvasTexture(canvas) });
}

// Three.js 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e3f2fd');
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(420, 420);
document.getElementById('cube-container').appendChild(renderer.domElement);

// 光源
const light = new THREE.DirectionalLight(0xffffff, 1.1);
light.position.set(5, 10, 7);
scene.add(light);

// 立方体
const geometry = new THREE.BoxGeometry(3.5, 3.5, 3.5);
const materials = faceData.map(createFaceMaterial);
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

// 交互控制
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = false;

// 渲染循环
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// --- 立方体面内容覆盖 ---
const overlay = document.createElement('div');
overlay.className = 'cube-face-overlay';
document.getElementById('cube-container').appendChild(overlay);

function updateOverlay() {
  // 计算当前正对用户的面
  const vector = new THREE.Vector3(0, 0, 1);
  vector.applyQuaternion(cube.quaternion.clone().invert());
  const faces = [
    { idx: 4, dot: vector.y }, // top
    { idx: 5, dot: -vector.y }, // bottom
    { idx: 0, dot: vector.z }, // front
    { idx: 1, dot: -vector.z }, // back
    { idx: 2, dot: vector.x }, // right
    { idx: 3, dot: -vector.x } // left
  ];
  faces.sort((a, b) => b.dot - a.dot);
  const faceIdx = faces[0].idx;
  overlay.innerHTML = faceData[faceIdx].html;
}
controls.addEventListener('change', updateOverlay);
updateOverlay();

// --- 覆盖区样式 ---
const style = document.createElement('style');
style.innerHTML = `
.cube-face-overlay {
  position: absolute; left: 0; top: 0; width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  pointer-events: none; z-index: 2;
}
.face-card { display: flex; flex-wrap: wrap; gap: 1.2rem; justify-content: center; }
.card {
  width: 110px; height: 110px; background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%);
  border-radius: 18px; box-shadow: 0 4px 16px #90caf9; display: flex; flex-direction: column; align-items: center; justify-content: center;
  font-size: 1rem; color: #1976d2; cursor: pointer; margin: 0.5rem 0; pointer-events: auto; transition: transform 0.2s;
}
.card i { font-size: 2rem; margin-bottom: 0.5rem; }
.card:hover { background: #bbdefb; transform: scale(1.08);}
.face-tip { margin-top: 1rem; color: #1976d2; font-size: 0.95rem;}
.face-btns { display: flex; flex-direction: column; gap: 1rem; align-items: center;}
.face-btn {
  background: #fff; border: 2px solid #42a5f5; border-radius: 12px; color: #1976d2; font-size: 1.1rem; padding: 0.7rem 1.5rem;
  box-shadow: 0 2px 8px #90caf9; cursor: pointer; pointer-events: auto; transition: background 0.2s, color 0.2s;
}
.face-btn i { margin-right: 0.5rem; }
.face-btn:hover { background: #e3f2fd; color: #42a5f5;}
.face-list { list-style: none; padding: 0; margin: 0; }
.face-list li {
  background: #f3e5f5; border-radius: 10px; margin: 0.7rem 0; padding: 1rem 2rem; color: #7e57c2; font-size: 1.1rem;
  display: flex; align-items: center; gap: 0.7rem; cursor: pointer; pointer-events: auto; transition: background 0.2s;
}
.face-list li:hover { background: #ede7f6; }
.face-indicator {
  background: linear-gradient(135deg, #e0f7fa 0%, #fff 100%);
  border-radius: 18px; box-shadow: 0 4px 16px #00bcd4; width: 180px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #00bcd4; font-size: 1.2rem; cursor: pointer; pointer-events: auto; transition: transform 0.2s;
  position: relative;
}
.face-indicator i { font-size: 3rem; margin-bottom: 1rem; }
.face-indicator:hover { background: #b2ebf2; transform: scale(1.08);}
.face-flow { display: flex; align-items: center; gap: 0.7rem; }
.flow-card {
  background: #fff3e0; border-radius: 12px; padding: 1rem 1.5rem; color: #ff7043; font-size: 1.1rem; box-shadow: 0 2px 8px #ff7043;
  display: flex; align-items: center; gap: 0.5rem; cursor: pointer; pointer-events: auto; transition: background 0.2s;
}
.flow-card:nth-child(3) { background: #ffe0b2; }
.flow-card:nth-child(5) { background: #ffccbc; }
.flow-card:hover { background: #ffd180; }
.arrow { font-size: 1.5rem; color: #ff7043; }
.face-graph {
  width: 180px; height: 180px; background: #e0f2f1; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; pointer-events: auto;
  box-shadow: 0 4px 16px #26a69a; transition: background 0.2s;
}
.face-graph .node { width: 38px; height: 38px; border-radius: 50%; background: #fff; position: absolute; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px #26a69a;}
.face-graph .main { left: 71px; top: 71px; background: #26a69a; color: #fff; font-size: 1.5rem;}
.face-graph .sub { background: #b2dfdb; }
.face-graph-tip { position: absolute; bottom: 10px; left: 0; width: 100%; text-align: center; color: #26a69a; font-size: 1.1rem;}
.face-graph:hover { background: #b2dfdb; }
`;
document.head.appendChild(style);