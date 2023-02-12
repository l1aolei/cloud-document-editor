*<u>5月14日</u>*

(1) 创建供electron使用的main.js文件, 配置主窗口

(2) 配置electron的环境, 使用concurrently和wait-on两个第三方插件实现同时执行两个命令, 只在electron窗口打开，且浏览器不打开

<u>*5月15日*</u>

(1) 在FileSearch组件中, 使用UseRef获取dom节点， 当Input框出现的时候自动获取焦点

(2) 使用bootstrap布局, 在左侧FileSearch和FileInput组件中, 监听键盘事件(enter和esc)

<u>*5月16日*</u>

(1) 创建自定义hook, 监听不同的键盘keyCode，进行不同的键盘事件

*<u>5月18日</u>*

(1) 使用第三方库simpleMDE作为富文本编辑器

(2) 目前并未使用到redux, 而是使用了react单向数据流的特性, 在APP.js根组件中创建所需要使用到的变量和方法并进行组件之间的传递

(3) 在右面板打开左边列表中的文件: 获取对应文件的id, 传入openedFileIDs数组, 再用find方法找对应的文件, 传入子组件中显示； 此外, 将对应id更新为activeFileID, 进行对应的高亮

(4) 关闭打开的文件: 获取对应的文件id,   这里使用e.stopPropagation()处理冒泡事件, 避免触发点击父级事件; 然后在openedFileIDs使用filter方法去掉对应的id, 并设置第一个打开的文件为activeFile

(5): 更新修改的文件内容: 富文本编辑器组件监听onChange, 拿到对应文件的id和content， 在已有的files进行map遍历， 修改对应文件的主体内容，并将此文件id添加到unsavedFileIDs中; 因为每次都要更新最新的files文件, 所以父组件的更新会导致父组件定义的函数重新生成从而传递给子组件的函数引用发生了变化，这就会导致子组件也会更新，所以富文本编辑器会输入完一个字符后重新加载然后失焦, 这里用useCallback缓存函数, 依赖项为空, 传入子函数的时候就不会导致子组件刷新

(6): 删除文件: 获取点击删除按钮对应的文件id, 使用filter过滤数组并更新, 同时执行 (4)

(7) 获取在Input框输入的关键词, 使用filter创建新数组保存搜索结果，并显示该新数组对应的文件, 关闭搜索框则进行一次空字符串的搜索，显示最初的文件列表

<u>***5月20日***</u>

(1) 使用electron-store第三方库进行持久化存储数据, 保存文件的地址是remote.app.getPath， 结合使用nodejs中的fs模块进行文件的新建, 重命名，保存文件

(2)  使用electron主进程的dialog模块导入文件, 获取导入文件地址, 生产新对象, 存入electron-store；使用electron主进程的menu模块, 实现获取文件id实现鼠标右键的点击, 重命名, 删除功能

*<u>5月22日</u>*

(1) 使用主进程模块中的Shell模块, 创建左上角的原生应用菜单, 使用ipcMain.send发送消息, 因为React在渲染进程当中, APP.js中使用ipcRenderer模块使用on()监听消息并触发回调

(2) 创建根据send的参数决定执行什么回调函数的自定义hook(传递一个对象, 命令为键, 回调为值)

