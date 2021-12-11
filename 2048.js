document.addEventListener('DOMContentLoaded', () => {    // 在DOM加载之后及资源加载之前被触发       //箭头函数简化了函数定义
    const gridDisplay = document.querySelector('.grid')  // 返回文档中匹配指定 CSS 选择器的一个元素
    const scoreDisplay = document.getElementById('score')
    const resultDisplay = document.getElementById('result')
    let boxes = [] // let局部变量
    const width = 4 // const声明一个只读的常量
    let score = 0

    // 创建游戏板，并增加两个模块
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            square = document.createElement('div')
            square.innerHTML = 0
            gridDisplay.appendChild(square)
            boxes.push(square) // push() 方法可向数组的末尾添加一个或多个元素
        }
        generate()
        generate()
    }
    createBoard()

    //增加新的数字
    function generate() {
        randomNumber = Math.floor(Math.random() * boxes.length)
        if (boxes[randomNumber].innerHTML == 0) {
            boxes[randomNumber].innerHTML = 2  // 将0的方框变为2
            checkForGameOver()
        } else generate()
    }

    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) { //选取每行的第一个
                let totalOne = boxes[i].innerHTML
                let totalTwo = boxes[i + 1].innerHTML
                let totalThree = boxes[i + 2].innerHTML
                let totalFour = boxes[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)] //用数组记录每行

                let filteredRow = row.filter(num => num) //？？？
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)  
                let newRow = zeros.concat(filteredRow) // 连接两个数组

                boxes[i].innerHTML = newRow[0]
                boxes[i + 1].innerHTML = newRow[1]
                boxes[i + 2].innerHTML = newRow[2]
                boxes[i + 3].innerHTML = newRow[3] // 更新消去后的数值
            }
        }
    }

    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = boxes[i].innerHTML
                let totalTwo = boxes[i + 1].innerHTML
                let totalThree = boxes[i + 2].innerHTML
                let totalFour = boxes[i + 3].innerHTML
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros) // 和右边拼接0方向不同

                boxes[i].innerHTML = newRow[0]
                boxes[i + 1].innerHTML = newRow[1]
                boxes[i + 2].innerHTML = newRow[2]
                boxes[i + 3].innerHTML = newRow[3]
            }
        }
    }


    function moveUp() {
        for (let i = 0; i < 4; i++) {  // 选取每列第一个
            let totalOne = boxes[i].innerHTML
            let totalTwo = boxes[i + width].innerHTML
            let totalThree = boxes[i + (width * 2)].innerHTML
            let totalFour = boxes[i + (width * 3)].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)

            boxes[i].innerHTML = newColumn[0]
            boxes[i + width].innerHTML = newColumn[1]
            boxes[i + (width * 2)].innerHTML = newColumn[2]
            boxes[i + (width * 3)].innerHTML = newColumn[3]
        }
    }

    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = boxes[i].innerHTML
            let totalTwo = boxes[i + width].innerHTML
            let totalThree = boxes[i + (width * 2)].innerHTML
            let totalFour = boxes[i + (width * 3)].innerHTML
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)

            boxes[i].innerHTML = newColumn[0]
            boxes[i + width].innerHTML = newColumn[1]
            boxes[i + (width * 2)].innerHTML = newColumn[2]
            boxes[i + (width * 3)].innerHTML = newColumn[3]
        }
    }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (boxes[i].innerHTML === boxes[i + 1].innerHTML) {
                let combinedTotal = parseInt(boxes[i].innerHTML) + parseInt(boxes[i + 1].innerHTML)
                boxes[i].innerHTML = combinedTotal
                boxes[i + 1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (boxes[i].innerHTML === boxes[i + width].innerHTML) {
                let combinedTotal = parseInt(boxes[i].innerHTML) + parseInt(boxes[i + width].innerHTML)
                boxes[i].innerHTML = combinedTotal
                boxes[i + width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score
            }
        }
        checkForWin()
    }

    //键盘指令
    function control(e) {
        if (e.keyCode === 37) { //左
            keyLeft()
        } else if (e.keyCode === 38) { //上
            keyUp()
        } else if (e.keyCode === 39) { //右
            keyRight()
        } else if (e.keyCode === 40) { //下
            keyDown()
        }
    }
    document.addEventListener('keyup', control) // 键被松开

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    //检查是否有方框为2048并胜利
    function checkForWin() {
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerHTML == 2048) {
                resultDisplay.innerHTML = '恭喜你，获胜了~~~'
                document.removeEventListener('keyup', control)
                setTimeout(() => clear(), 3000) //3秒后清除
            }
        }
    }

    //检查是否有零，没有就输了
    function checkForGameOver() {
        let zeros = 0
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerHTML == 0) {
                zeros++
            }
        }
        if (zeros === 0) {
            resultDisplay.innerHTML = '很抱歉，你输了~~~'
            document.removeEventListener('keyup', control)
            setTimeout(() => clear(), 3000)
        }
    }

    //停止调用函数
    function clear() {
        clearInterval(myTimer)
    }


    //不同方框对应不同颜色
    function addColours() {
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerHTML == 0) boxes[i].style.backgroundColor = '#afa192'
            else if (boxes[i].innerHTML == 2) boxes[i].style.backgroundColor = '#eee4da'
            else if (boxes[i].innerHTML == 4) boxes[i].style.backgroundColor = '#ede0c8'
            else if (boxes[i].innerHTML == 8) boxes[i].style.backgroundColor = '#f2b179'
            else if (boxes[i].innerHTML == 16) boxes[i].style.backgroundColor = '#ffcea4'
            else if (boxes[i].innerHTML == 32) boxes[i].style.backgroundColor = '#e8c064'
            else if (boxes[i].innerHTML == 64) boxes[i].style.backgroundColor = '#ffab6e'
            else if (boxes[i].innerHTML == 128) boxes[i].style.backgroundColor = '#fd9982'
            else if (boxes[i].innerHTML == 256) boxes[i].style.backgroundColor = '#ead79c'
            else if (boxes[i].innerHTML == 512) boxes[i].style.backgroundColor = '#76daff'
            else if (boxes[i].innerHTML == 1024) boxes[i].style.backgroundColor = '#beeaa5'
            else if (boxes[i].innerHTML == 2048) boxes[i].style.backgroundColor = '#d7d4f0'
        }
    }
    addColours()

    var myTimer = setInterval(addColours, 50) // 不停地调用函数

    document.addEventListener("click", redo)

    function redo(){
        alert('hello')
    }


})

