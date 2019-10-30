namespace test {
  /** ts 版本 */
  /** 
   * 贪吃蛇代码非原创，在基础代码上添加:
   * 1. 动态创建 canvas 标签
   * 2. 增加重新游戏功能
   * 3. 增加棋盘内容
   * 4. 关键数据动态化(自定义棋盘大小)
   * 5. 增加游戏得分
   */
  const gameConfig = {
    width: 400,
    height: 400,
    /** 每格的尺寸 */
    itemSize: 20,
  }

  const { itemSize } = gameConfig;
  /** 
   *   
   * dz: 食物位置
   * fx: 方向
   * n: 蛇头位置
   * init_n: 初始蛇头位置
   * timer: 计时器
   * ctx: canvas 上下文
   * score: 当前游戏得分
   * isGameOver: 游戏是否结束。true: 游戏结束
   */
  /** sn: 蛇身数组 */
  var sn = [42, 41];
  /**  */
  var init_sn = [42, 41];
  /** */
  var dz = 43;
  var fx = 1;
  var init_n = 43;
  var n;
  var timer = null;
  var isGameOver = false;
  var ctx: CanvasRenderingContext2D;
  var score = 0;
  var oGame = document.getElementById('game');
  var oScore = document.getElementById('score');

  // ================================================================================
  // dom 元素相关
  // ================================================================================
  function createCanvas() {
    // <canvas id="can" width="400" height="400" style="background:Black"></canvas>
    // <!--建立画布层 宽400像素 高400像素 颜色:黑色 -->
    const oCan = document.createElement('canvas');
    oCan.id = 'can';
    oCan.width = 400;
    oCan.height = 400;
    oCan.style.background = 'Black';
    oGame.appendChild(oCan);
    
    ctx = oCan.getContext("2d");
    test(ctx);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} aaa 
   */
  function test(aaa) {
    // aaa.strokeStyle = 131313;
    ctx.strokeStyle
  }
  

  createCanvas();

  const oResetBtn = document.getElementById('reset');
  oResetBtn.addEventListener('click', () => {
    isGameOver = false;
    oScore.innerText = '0';
    
    // 重置数据.
    // sn = init_sn;
    // dz = 43;
    // fx = 1;
    // score = 0
    run();
  });

  /** 游戏重置按钮显示和隐藏 */
  function toggleRestBtn(mark) {
    const s = mark ? 'block' : 'none';
    oResetBtn.style.display = s;
  }

  function updateGameScore() {
    score++;
    oScore.innerText = `${score}`;
  }

  /** 绘制底部棋盘 */
  function drawBellowMap(xMax, yMax) {
    ctx.strokeStyle = '#1576F7';
    const yPointStart = 20;
    const yPointArr = [];
    // 400 * 20 = 20
    for (let i = 0; i < 20; i++) {
      const nowYPoint = i * yPointStart + yPointStart;
      yPointArr.push(nowYPoint);
    };
    // const yPointArr = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, ]
    for (let i = 0; i < yPointArr.length; i++) {
      const yPoint = yPointArr[i];
      ctx.moveTo(0, yPoint);
      ctx.lineTo(400, yPoint);
      ctx.stroke();
    }

    const xPointArr = yPointArr;
    for (let i = 0; i < xPointArr.length; i++) {
      const xPoint = xPointArr[i];
      ctx.moveTo(xPoint, 0);
      ctx.lineTo(xPoint, 400);
      ctx.stroke();
    }
    
  }
  drawBellowMap(1, 1);

  /**
   * 绘图层
   * 
   * @param {Number} t 蛇头位置.
   * @param {String} c 颜色
   */
  function draw(t, c) {         //声明function绘图函数   参数(t为位置 c为颜色)
    ctx.fillStyle = c;		//方块颜色
    const pos = itemSize - 2;
    ctx.fillRect(t % itemSize * itemSize + 1, ~~(t / itemSize) * itemSize + 1, pos, pos);   //画矩形函数(坐标,长各宽18)
  }

  /**
   * 交互层
   */
  document.onkeydown = function (e: any) {       //按下键盘则发生此事件,操作全局变量
    // ~ 正负数取反
    const negativeItemSize = ~itemSize;
    fx = sn[1] - sn[0] == (n = [-1, -20, 1, 20][(e || event).keyCode - 37] || fx) ? fx : n
    //keyCode ←37 ↑38 →39 ↓40 数组索引赋值给n
  };

  /** 逻辑层 */
  function logic() {
    sn.unshift(n = sn[0] + fx);   //unshift在数组sn头部添加元素

    //死亡判定
    if (sn.indexOf(n, 1) > 0 || n < 0 || n > 399 || fx == 1 && n % 20 == 0 || fx == -1 && n % 20 == 19) {
      //(自我碰撞检测)(上下碰撞检测)(左右碰撞检测)
      isGameOver = true;
      clearTimeout(timer);
      return alert("Game Over!!!");
    }
    draw(n, "Lime");	// 蛇身颜色 lime 闪光绿

    if (n == dz) {        //判断是否吃到食物
      while (sn.indexOf(dz = ~~(Math.random() * 400)) >= 0);//~~取整
      //indexOf返回某个指定的字符串值在字符串中首次出现的位置
      draw(dz, "Yellow");   //食物颜色 yellow 黄色

      // 更新分数
      // TODO: 游戏开始时下面就会执行，为了避免游戏开始时分数就+1
      // 采取了下面的措施
      if (n !== init_n) updateGameScore();
    } else      // 尾巴擦除,吃到食物则不擦除，以擦来实现移动效果，不擦来实现成长
      draw(sn.pop(), "Black");	   //pop方法，删除并返回数组末尾元素
  }

  /**
   * 游戏开始运行
   */
  function run() {
    if (isGameOver) {
      toggleRestBtn(true);
      return;
    }
    toggleRestBtn(false);

    logic();
    timer = setTimeout(run, 130);//时间循环函数（游戏速度） 初始130
  }
  run();

}