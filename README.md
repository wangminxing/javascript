
# 变量 #


1.  BlogsSetting[]:存放七种类型的方块
2.  GameMap[]:游戏地图，对应table中的td值
3.  BlockWidth:28,方块集的宽高
4.  HorizontalNum:10,水平方块集数量
5.  VerticalNum:18,垂直方向方块集数量
6.  BlokSize:4,设置方块占用位置为4*4
7.  BlockWidth:0,用来获取当前方块的非0的最大宽度
8.  BlockHeight:0,用来获取当前方块的非0的最大高度
9.  CurrentIndex:0,当前随机获得的索引
10. NextCurrentIndex:0，获取下一个方块的索引
11. BlokCurrent[]:,表示当前方块
12. InitPosition:{}当前方块运动的x,y
13. IsPlay:false,游戏是否开始
14. IsOver：false,游戏是否结束
15. IsOverIndex:0,设置游戏结束的索引，距离游戏结束还有几行
16. Score:0,
17. ScoreIndex:100,每消除一行，得分100，
18. ColorEnum[],颜色的枚举，对应BlogsSetting
# 方法 #
1.  CreateMap:function(){}创建地图
2.  CreatePreViewMap:function(){}加载一个4*4表格到预览区域
3.  SettingBlock:function(){}设置地图中方块的背景图片
4.  CanMove:function(x,y){}根据传过来的x,y，检测方块是否能左右下移动
5.  ClearOldBlok:function(){}每次左右下移动时清除方块，使得重新绘制方块
6.  MoveRight:function(){}向右移动
7.  MoveDown:function(){}向下移动
8.  ChangeBlock:function(){}方ction(){}创建方块，初始化数据
12.  GameOver:function(){}游戏结束后补齐获得当前方块，补齐地图空白地方
13.  SettingGameMap:function(){}，设置游戏地图被占有的位置标记为1
14.  Start:function(){}游戏开始
15.  CreateNextBlock:function(){}获取下一个方块的索引，并显示在预览区域中
16.  GetHeight:function(blokArr){}获取当前方块不是0的最大高值
17.  GetWidth:function(blokArr){}获取当前方块不是0的最大宽值
18.  GetInitPosition:function(){}获取方块的初始位置
19.  getRandom:function(){}随机获得7种方块中的其中一种
20.  getTable:function(){}
21.  getScore:function(){}
22.  getRank:function() {}
# 游戏规则 #
遇满行，则消除，每消除得分100
游戏规则：游戏由 ↑ ↓ → ← 方向键控制。
　　↑：方块变型
　　↓：加速下落
　　→：向右移动
　　←：向左移动
　　P：暂停或开始游戏 
# 总体思路 #
  - 首先用BlogsSetting[]来存放七种类型的方块，用BlokCurrent[]来存放当前的方块。关于游戏的操作放在function KeyDown{}中，然后 function InitGame(){}调用Teris对象的各种函数，来实现游戏。Teris对象的方法和变量如上。游戏开始时，表示游戏开始的IsPlay为true,当前方块的索引为下一个方块的索引，然后根据当前方块的索引来来确定当前方块，获取当前方块的最大非0宽度和高度，调用GetInitPosition(){}方法来获取方块的初始位置（初始位置位置是居中的，y为-1），执行向下移动函数，在执行移动操作时，要进行边界检测和轨迹检测。即是否存在移动过后当前方块的位置x超过游戏地图，且移动时，是否方块的下左右有方块而不能移动的情况，表示方块占据游戏地图的方式是设置GameMap数组的相应位置为1.主要考虑的是方块的移动和方块的变形，和方块的检测及其清行判断。
# 主要功能及实现思路 #
1. 方块的运动
   - MoveLeft:function(){}//方块向左运动
   首先检测方块向左移动是否超过左边界，再检测方块是否能向左运动，如果可以移动则调用 ClearOldBlok:function(){}方法，来清除方块，使得能够重新绘制方块。并且设置当前x的值为x-1,来达到左移的目的。并且调用SettingBlock:function(){}来设置方块中的背景图片。
   - MoveRight:function(){}//方块向右运动
   首先检测方块向右移动时是否超过右边界，再检测方块是否能向右运动，即是否方块右方是否有已经占据地图的方块挡住方块向右运动，如果可以移动则调用ClearOldBlok:function(){}方法，来清除方块，使得能够重新绘制方块。并且设置当前x的值为x+1,来达到右移的目的。并且调用SettingBlock:function(){}来设置方块中的背景图片。
   - MoveDown:function(){}//向下运动  首先检查方块是否能向下运动，如果可以向下运动，则调用 ClearOldBlok:function(){}方法，来清除方块，使得能够重新绘制方块。并且设置当前y的值为y+1,来达到下移的目的。并且调用SettingBlock:function(){}来设置方块中的背景图片。并且设置游戏地图中游戏被占有的位置为1，并且要调用
   CheckFull:function(){}方法检查是否有满行，然后获取下一个方块。
 
2. 方块的变形 
   -  ChangeBlock:function(){}//方块变形 首先准备一个新的数组newBlock[]备用。 然后遍历当前方块数组，将当前方块的值赋给newBlock[]，这里的方块变型的公式参照网上。然后将newBlock数组赋给当前数组，以达到方块变型的目的。重新获得当前方块数组BlokCurrent[]的最大非0高度BlockHeight和最大非0宽度BlockWidth，检测方块在当前位置变型后的x+它的宽度是否有超过地图的宽度，如果没有则调用SettingBlock:function(){}设置地图中方块的背景图片。
3. 方块的检测
   - CanMove:function(x,y){}//检测方块是否能向左右下移动  首先判断当前位置y+当前方块的最大高度是否有到最底部，如果到最底部，则停止向下运动。然后检测方块的最高坐标相对应的地图的坐标是否有都等于1，如果有等于1说明地图放不下该方块。
4. 清除满行
   - CheckFull:function(){}//检测满行 首先检测游戏地图中是否有满行。遍历GameMap[]数组，如果找到该数组元素中有0，则游戏地图中没有满行，反之，则游戏地图中有满行，ClearFull(i)函数，清除掉该满行。
   - ClearFull:function(index){} /如果有满行则清除掉该满行，并且计算得分。  首先加载对应于游戏地图的表格。 如果第一行满行的话，则背景清空。如果非第一行为满行的话，就使上一行的背景图等于该行，并使上一行的坐标值等于该行。且每次执行清行操作时都要获取当前的分数，并且在当前的分数上加上ScoreIndex(100)来表示目前获得的分数。