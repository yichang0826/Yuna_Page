// Create a Matter.js engine with zero gravity
const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });

// Create a canvas for the balloons
const canvas = document.getElementById('balloon-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 创建气球数组
const balloons = [];

// 创建气球对象并将它们添加到数组中
for (let i = 0; i < 10; i++) {
    const radius = 20 + Math.random() * 10; // 随机半径
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight / 2; // 初始Y坐标设置为窗口的一半

    // 创建气球
    const balloon = Matter.Bodies.circle(x, y, radius, {
        frictionAir: 0.02, // 减小空气摩擦
        restitution: 0.3 + Math.random() * 0.4, // 随机弹力
        density: 0.001 + Math.random() * 0.002, // 随机密度
    });

    // 设置气球的颜色和透明度
    balloon.render.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;

    // 将气球添加到数组
    balloons.push(balloon);

    // 添加气球到物理世界
    Matter.World.add(engine.world, [balloon]);
}

// Enable mouse dragging for the balloons
Matter.World.add(engine.world, Matter.MouseConstraint.create(engine));

// Main loop
Matter.Engine.run(engine);

// Render function
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // for (let i = 0; i < balloons.length; i++) {
    //     const balloon = balloons[i];
    //     ctx.beginPath();
    //     ctx.arc(balloon.position.x, balloon.position.y, balloon.circleRadius, 0, 2 * Math.PI);
    //     ctx.fillStyle = balloon.render.fillStyle;
    //     ctx.fill();
    // }
    for (let i = 0; i < balloons.length; i++) {
        const balloon = balloons[i];
    
        // 球体边界检查
        if (balloon.position.x < canvas.width * 0.25) {
            balloon.position.x = canvas.width * 0.25;
            balloon.velocity.x = Math.abs(balloon.velocity.x); // 阻止向左移动
        } else if (balloon.position.x > canvas.width * 0.75) {
            balloon.position.x = canvas.width * 0.75;
            balloon.velocity.x = -Math.abs(balloon.velocity.x); // 阻止向右移动
        }
    
        if (balloon.position.y < canvas.height * 0.25) {
            balloon.position.y = canvas.height * 0.25;
            balloon.velocity.y = Math.abs(balloon.velocity.y); // 阻止向上移动
        } else if (balloon.position.y > canvas.height * 0.75) {
            balloon.position.y = canvas.height * 0.75;
            balloon.velocity.y = -Math.abs(balloon.velocity.y); // 阻止向下移动
        }
    
        // 更新气球位置
        balloon.position.x += balloon.velocity.x;
        balloon.position.y += balloon.velocity.y;
    
        // 渲染气球
        ctx.beginPath();
        ctx.arc(balloon.position.x, balloon.position.y, balloon.circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = balloon.render.fillStyle;
        ctx.fill();
    }
    
}

// Run the render function
Matter.Events.on(engine, 'beforeUpdate', function () {
    render();
});



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
    sakura.rotationSpeed = Math.random() * Math.random(); // 随机旋转角度范围

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
