import React from'react';
import './App.less';
import { Game } from 'block_game'

const wide_const = 20
const high_const = 30

function App() {
  const game = React.useRef(null)
  const reqAFIndex = React.useRef(null)

  const [minute, setMinute] = React.useState(0)
  const [second, setSecond] = React.useState(0)
  const [time, setTime] = React.useState(0)

  const [containerFull, setContainerFull] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [level, setLevel] = React.useState(4)
  const [speedTiem, setSpeedTime] = React.useState(0)

  const [containerValue, setContainerValue] = React.useState(Array.from({length: high_const}).fill(0))
  const [nextSquareValue, setNextSquareValue] = React.useState([0, 0, 0, 0])

  React.useEffect(() => {
    game.current = new Game(high_const, wide_const)
    game.current.add_square()

    setContainerValue(game.current.current_matrix_value())
    setNextSquareValue(game.current.get_square_value())
  }, [])

  const fn = React.useCallback(async () => {
    setTime(t => {
      const nowTime = new Date().getTime()
      const diffTime = nowTime - t
      if (diffTime >= 1000) {
        setSecond(s => {
          const newSecond = s + 1
          if (newSecond >= 60) {
            setMinute(minute => minute + 1)
          }
          return newSecond % 60
        })
        return nowTime
      }
      return t
    })

    setSpeedTime(async (t) => {
      const nowTime = new Date().getTime()
      const diffTime = nowTime - await t
      let l = await new Promise(resolve => { setLevel((level) => { resolve(level); return level})})
      l = Math.min(l, 9)
      if (diffTime >= 1000 * (1 - Math.log(l) / Math.log(10))) {
        handleDown()
        return nowTime
      }
      return await t
    })
    let isFull = await new Promise(resolve => { setContainerFull((isUfll) => { resolve(isUfll); return isUfll})})
    if (isFull) {
      alert('游戏结束！')
    } else {
      window.requestAnimationFrame(() => { fn()})
    }
  }, [])

  React.useEffect(() => {
    setTime(Date.now())
    setSpeedTime(Date.now())
    fn()
    return () => {
      window.cancelAnimationFrame(reqAFIndex.current)
    }
  }, [])

  const upDateHandler = () => {
    setContainerValue(game.current.current_matrix_value())
    setNextSquareValue(game.current.get_square_value())
    setContainerFull(game.current.container_is_full())
  }

  const handleDown = (event) => {
    const lenght = game.current.move_square_down();
    if(lenght > 0) {
      setScore(score => score + lenght)
    }
    upDateHandler()
  }
  const handleLeft = (event) => {
    game.current.move_square_left()
    upDateHandler()
  }
  const handleRight = (event) => {
    game.current.move_square_right()
    upDateHandler()
  }
  const handleClockwise = (event) => {
    game.current.clockwise_rotate_square()
    upDateHandler()
  }
  const handleConterclockwise = (event) => {
    game.current.counterclockwise_rotate_square()
    upDateHandler()
  }

  return (
    <div className='app'>
      <div></div>
      <div className='center'>
        <div 
          className='container'
          style={{ gridTemplateColumns: `repeat(${wide_const}, 1fr)` }}
        >
          {
            containerValue
            .reduce((r, i) => {
              const str = i.toString('2').padStart(wide_const, '0')
              r.push(...str.split(''))
              return r
            }, [])
            .map((s, index) => {
              // console.log('index=', index)
              return <div className={`item ${s === '1' ? 'active' : ''}`} key={index} />
            })
          }
        </div>

        <div className='statusBar'>
          <div className='score'>
            <p>当前分数</p>
            <div>{score}</div>
          </div>
          <div className='nextSquare'>
            <p>下一个</p>
            <div
              className='square'
              style={{ gridTemplateColumns: `repeat(4, 1fr)` }}
            >{
              nextSquareValue
                .reduce((r, i) => {
                  const str = i.toString('2').padStart(4, '0')
                  r.push(...str.split(''))
                  return r
                }, [])
                .map((s, index) => {
                  return <div className={`item ${s === '1' ? 'active' : ''}`} key={index} />
                })
              }</div>
          </div>
          
          <div className='time'>
            <p>游戏时间</p>
            <div className='timerNumber'><span>{minute.toString().padStart(2, '0')}</span>:<span>{second.toString().padStart(2, '0')}</span></div>
          </div>
        </div>
        
      </div>

      <div className='footerButtons'>
        <div className='direction'>
          <button className='up' onClick={() => {}}>上</button>
          <button className='left' onClick={handleLeft}>左</button>
          <button className='right' onClick={handleRight}>右</button>
          <button className='down' onClick={handleDown}>下</button>
        </div>
        <div className='transform'>
           <button className='clockwise' onClick={handleClockwise}>顺旋转</button>
           <button className='counterclockwise' onClick={handleConterclockwise}>逆旋转</button>
        </div>
      </div>
      
    </div>
  );
}

export default App;
