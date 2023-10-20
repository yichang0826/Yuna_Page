// 氣球 -> 撞球
// 櫻花 飄落

console.log(`基本資訊：innerHeight:${innerHeight},innerWidth:${innerWidth}`);

//#region balloon info
// 获取对<div>元素的引用
const balloonInfoDiv = document.getElementById('balloon-info');

// 创建一个函数来更新信息
function updateBalloonInfo(balloon) {
    const infoText = `x: ${balloon.position.x.toFixed(2)},
    y: ${balloon.position.y.toFixed(2)}, 
    vx: ${balloon.velocity.x.toFixed(2)}, 
    vy: ${balloon.velocity.y.toFixed(2)},
    speed: ${balloon.speed}`;

    // 将信息显示在<div>中
    balloonInfoDiv.textContent = infoText;
}
//#endregion

//#region Matter World
// Create a Matter.js engine with zero gravity
const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.1 } });

// Create a canvas for the balloons
const canvas = document.getElementById('balloon-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//#region 牆壁
// 创建一个边界墙壁
const wallOptions = {
    isStatic: true, // 让墙壁保持静止，不受力的影响
    restitution: 1, // 弹性恢复为1，意味着物体碰到墙壁后不会减速
    friction: 0, // 摩擦力为0，意味着物体在墙壁上不会受到摩擦力的影响
};

const wallThickness = 1000; // 墙壁的厚度

// 创建上边界
const topWall = Matter.Bodies.rectangle(
    canvas.width / 2,
    -wallThickness / 2,
    canvas.width + 2 * wallThickness,
    wallThickness,
    wallOptions
);

// 创建下边界
const bottomWall = Matter.Bodies.rectangle(
    canvas.width / 2,
    canvas.height + wallThickness / 2,
    canvas.width + 2 * wallThickness,
    wallThickness,
    wallOptions
);

// 创建左边界
const leftWall = Matter.Bodies.rectangle(
    -wallThickness / 2,
    canvas.height / 2,
    wallThickness,
    canvas.height + 2 * wallThickness,
    wallOptions
);

// 创建右边界
const rightWall = Matter.Bodies.rectangle(
    canvas.width + wallThickness / 2,
    canvas.height / 2,
    wallThickness,
    canvas.height + 2 * wallThickness,
    wallOptions
);

// 将墙壁添加到物理世界
Matter.World.add(engine.world, [topWall, bottomWall, leftWall, rightWall]);
//#endregion

//#region 球體
// 创建气球数组
const balloons = [];

console.log("球體半徑：", Math.round(window.innerWidth / 20));

// 创建气球对象并将它们添加到数组中
for (let i = 0; i < 20; i++) {
    const radius = window.innerWidth / 20 + Math.random() * 80; // 随机半径
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight; // 初始Y坐标设置为窗口的一半

    // 创建气球
    const balloon = Matter.Bodies.circle(x, y, radius, {
        frictionAir: 0.02, // 减小空气摩擦
        restitution: 0.2 + Math.random() * 0.5, // 随机弹力
        density: 0.001 + Math.random() * 0.002, // 随机密度
    });

    // 设置气球的颜色和透明度
    balloon.render.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;

    // 将气球添加到数组
    balloons.push(balloon);

    // 添加气球到物理世界
    Matter.World.add(engine.world, [balloon]);
}

// Enable mouse dragging for the balloons
Matter.World.add(engine.world, Matter.MouseConstraint.create(engine));

// Render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balloons.length; i++) {
        const balloon = balloons[i];
        // updateBalloonInfo(balloon);

        ctx.beginPath();
        ctx.arc(balloon.position.x, balloon.position.y, balloon.circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = balloon.render.fillStyle;
        ctx.fill();
    }
}
//#endregion

// Main loop
Matter.Engine.run(engine);

// Run the render function
Matter.Events.on(engine, 'beforeUpdate', function () {
    render();
});
//#endregion Matter World

//#region 櫻花效果

// 创建PixiJS应用
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: true,
});

// 添加PixiJS渲染器到文档
document.body.appendChild(app.view);

// 创建樱花纹理
const sakuraTexture = PIXI.Texture.from('sakura.png');

// 创建樱花容器
const sakuraContainer = new PIXI.ParticleContainer();
app.stage.addChild(sakuraContainer);

// 添加樱花到容器中
const sakuraArray = [];

for (let i = 0; i < 100; i++) {
    const sakura = new PIXI.Sprite(sakuraTexture);
    sakura.x = Math.random() * window.innerWidth;
    sakura.y = Math.random() * -100; // 初始位置在屏幕上方
    sakura.scale.set(0.1 + Math.random() * 0.3); // 縮放比例
    sakura.alpha = 0.5 + Math.random() * 0.5; // 透明度

    // 添加速度属性（随机速度）
    sakura.velocityY = 0.5 + Math.random() * 1.5; // 随机速度范围

    // 添加旋转角度属性（随机角度）
    sakura.rotationSpeed = Math.random(); // 随机旋转角度范围

    sakuraContainer.addChild(sakura);
    sakuraArray.push(sakura);
}

// 创建动画循环
app.ticker.add(() => {
    sakuraArray.forEach(sakura => {
        sakura.y += sakura.velocityY;
        sakura.rotation += sakura.rotationSpeed; // 旋转角度
        sakura.x += Math.sin(sakura.y * 0.02) * Math.random(); // 添加水平摆动效果
        if (sakura.y > window.innerHeight) {
            sakura.y = -100; // 重新放置到屏幕上方
            sakura.x = Math.random() * window.innerWidth;
        }
    });
});
//#endregion
