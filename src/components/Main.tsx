import { useEffect, useState } from "react"
import { useHistory } from "react-router"
// import json from './commands.json'
// import Hinmoku from "./Hinmoku"


// function getStorage(key: string): string | null {
//   try {
//     return localStorage.getItem(key)
//   } catch (error) {
//     return null
//   }
// }
// function setStorage(key: string, value: string): void {
//   try {
//     localStorage.setItem(key, value)
//   } catch (error) {}
// }

const OptionCheckbox: React.FC<{
  onChange: React.ChangeEventHandler<HTMLInputElement>
  checked: boolean
}> = ({ checked, onChange, children }) => (
  <label className="inline-flex items-center m-1">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{children}</span>
  </label>
)



type Hinsyu = "jouon" | "chilled"
type HinmokuState = "" | "fin"
type Hinmoku = {
  id: string
  hinsyu: Hinsyu
  label: string
  num: string
  state: HinmokuState
}

type Shop = {
  id: string
  label: string
  hinmokus: Hinmoku[]
}

const def_labels = [
  ["tokatu", "トオカツ"],
  ["sinobu", "シノブ"],
  ["koubo", "酵母パン"],
  ["daiiti", "第一パン"],
  ["sikijima", "敷島製パン"],
  ["ito", "伊藤パン"],
  ["fuji", "フジパン"],
  ["koube", "神戸屋"],
  ["kice", "Kアイス"],
  ["nasio", "ナシオ"],
  ["kokubu", "国分常温"],
]

const def_labels_chilled = ["チルド", "トオカツ", "デリア", "三桂"]

const makeHinmokus = (hinsyu: Hinsyu, labels: string[][]): Hinmoku[] =>
  labels.map(([id, label]) => ({ id, hinsyu, label, num: "", state: "" }))

const def_shop_names: string[][] = [
  ["", ""],
  ["keiou_sinano", "慶応信濃町"],
  ["keiou_mita", "慶応義塾大学 三田購買部"],
  ["keiou_kyouritu", "慶応義塾大学芝共立キャンパス"],
  // "慶應女子高",
  // "日本赤十字看護大学",
  // "早稲田twins",
  // "明治学院白金",
  // "星薬科大学",
  // "海洋大学",
  // "理科大学 神楽坂店",
  // "法政大学 市ヶ谷購買書籍部",
]

// 編集モード：品目の数量編集するモード
// チェックモード：数量通りの確認作業モード

type Mode = "edit" | "check"

const Main: React.FC<{ lang: string }> = ({ lang }) => {
  const [inputShopName, setInputShopName] = useState("")
  const [selectShopName, setSelectShopName] = useState("")
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [mode, setMode] = useState<Mode>("edit")
  const [testHin , setTestHin] = useState({label: "test-hin", num: ""})

  const history = useHistory()
  const title = "生協"
  useEffect(() => {
    document.title = title
  }, [history.location, title])

  const test = () => {}

  const testAdd = () => {
    if (!selectedShop) return

    setShops((shops) => {
      return shops.map((shop) => {
        if (shop.label === selectedShop.label) {

          return {
            ...shop,
            hinmokus: shop.hinmokus.map(hin => {
              if (hin.label === "トオカツ") {
console.log('too')

                const pre = hin.num === "" ? 0 : +hin.num
                
                console.log('pre ', pre);
                
             return {
                  ...hin,
                  num: "" + (pre + 1)
                }
              }
              return hin
            })
          }
        }
        return shop
      }
      )
    })
  }

  const changeSelectedShopHinmoku = (hin: Hinmoku, cb: (h: Hinmoku) => Hinmoku) => {
    if (!selectedShop) return
    setShops((shops) => {
      return shops.map((shop) => {
        if (shop.label !== selectedShop.label) return shop
        const new_shop = {
          ...shop,
          hinmokus: shop.hinmokus.map((h) => {
            if (h.label !== hin.label) return h 
            const new_hinmoku = cb(h)
            console.log('new_hinmoku', new_hinmoku);
            return new_hinmoku
          }),
        }
        return new_shop
      })
    })
  }

  const changeHinmokuState = (hin: Hinmoku, state: HinmokuState) => {
    changeSelectedShopHinmoku(hin, (preHinmoku) => {
      return {
        ...preHinmoku,
        state
      }
    })
  }
  const setHinmokuNum = (hin: Hinmoku, cb: (pre: string) => string) => {
    if (!selectedShop) return
    setShops((shops) => {
      return shops.map((shop) => {
        if (shop.label === selectedShop.label) {
          const new_shop = {
            ...shop,
            hinmokus: shop.hinmokus.map((h) => {
            
              // const new_hinmoku: Hinmoku = {
              //   hinsyu: h.hinsyu,
              //   label: h.label,
              //   num: ""
              // }

              // const new_hinmoku = Object.assign({}, h)
              // const new_hinmoku = h
              const new_hinmoku = {...h}

              if (h.label === hin.label) {
                const new_num = cb(new_hinmoku.num)
                console.log('new_num', new_num);
                
                new_hinmoku.num = new_num
                console.log('new_hinmoku', new_hinmoku);
              }
              
              return new_hinmoku
            }),
          }
          console.log('new_shop', new_shop);
          console.log('a', new_shop.hinmokus[0])
          
          
          return new_shop
        }
        return shop
      })
    })
  }
  // React.InputHTMLAttributes<HTMLInputElement>.onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  const handleChangeHinmokuNum = (hin: Hinmoku, value: string) => {
    setHinmokuNum(hin, (pre) => value)
  }

  const handleAddNum = (hin: Hinmoku, num: number) => {
    setHinmokuNum(hin, (pre: string) => {
      console.log('pre', pre, 'num', num);
      const _pre = !pre ? 0 : (+pre)
      const new_value = "" + (_pre + num) 
      console.log('new_value', new_value);
      
      return new_value
    })
  }
  const addShop = (label: string) => {
    console.log("addShop", label)

    const new_shops = shops.concat([
      {
        id: "shop_" + Date.now(),
        label,
        hinmokus: makeHinmokus("jouon", def_labels),
      },
    ])
    console.log("new_shops", new_shops)
    setShops(new_shops)
    setInputShopName("")
  }

  // 大学名プルダウンが変更されたらテキストにその名前をセットする
  useEffect(() => {
    const name = def_shop_names.find((s) => s[0] === selectShopName)
    if (!name) return
    setInputShopName(name[1])
  }, [selectShopName])

  const BtnAddNum: React.FC<{
  hin: Hinmoku
  num: number
}> = ({ hin, num, children }) => (
<button className="bg-green-900 p-2 m-1 rounded " onClick={()=>handleAddNum(hin, num)}>
                              {num >= 0 ? "+" : ""}{num}
                            </button>
)

const selectedHinmokus = () => {
  if (!selectedShop) return []
  const hinmokus = shops.find(s => s.id === selectedShop.id)!.hinmokus
  if (mode === "check") return hinmokus.filter(h => h.num !== "")
  return hinmokus
}

  return (
    <div className="App p-5">
      <h1 className="text-3xl p-1 text-center">{title}</h1>

      <label htmlFor="">{ testHin.label}</label>
      <input type="text" name="" id="" className="text-black"
        value={testHin.num} onChange={(e) => {
          setTestHin({
            label: testHin.label,
            num: e.target.value
          })
        }} />
      <button onClick={() => setTestHin(pre => {
        return {
          label: testHin.label,
          num: "" + (+pre.num + 1)
        }
      })}>+1</button>

      {!selectedShop && (
        <div>
          {/* 大学名プルダウン */}
          <select
            className="text-black p-3 m-3"
            value={selectShopName}
            onChange={(e) => {
              const value = e.target.value
              console.log("value", value)
              setSelectShopName(value)
              console.log("selectShopName", selectShopName)
            }}
          >
            {def_shop_names.map((name) => {
              return <option value={name[0]} key={name[0]}>{name[1]}</option>
            })}
          </select>

          <input
            type="text"
            name=""
            id="input-shop-name"
            className="border p-2 rounded text-gray-900"
            value={inputShopName}
            onChange={(e) => setInputShopName(e.target.value)}
          />
          <button className="bg-green-900 p-2 m-1 rounded " onClick={() => addShop(inputShopName)}>
            大学追加
          </button>
        </div>
      )}

      <div>shops: {shops.length}</div>
      <div>mode: {mode}</div>

      <button className="bg-green-900 p-2 m-1 rounded " onClick={() => setMode("edit")}>
        to edit mode
      </button>
      <button className="bg-green-900 p-2 m-1 rounded " onClick={() => setMode("check")}>
        to check mode
      </button>

  {/* 大学名一覧 */}
      {!selectedShop &&
        shops.map((shop) => {
          return (
            <div key={shop.id}>
              <button className="bg-green-900 p-2 m-1 rounded " onClick={() => setSelectedShop(shop)}>
                {shop.label}
              </button>
            </div>
          )
        })}

      {/* 選択された大学 */}
      {selectedShop && (
        <div>
          <>
            <div className="relative">
              <div className="opacity-100 z-50 text-2xl fixed  top-0 left-0 right-0 bg-blue-900 p-3">
                <div>{selectedShop.label}</div>
                <button className="right-0 float-right" onClick={() => setSelectedShop(null)}>
                  return
                </button>
              </div>
            </div>

            <div className="relative">
              <table className="hinmoku">
                <tbody>

                  {
                    
                    selectedHinmokus().map((hin, index) => {
                  return (
                    <tr key={hin.id}>
                      <td className="border-solid border">{hin.label}</td>
                      <td className="border-solid border">
                        <input
                          type="number"
                          onChange={(e)=>handleChangeHinmokuNum(hin, e.target.value)}
                          className="num border p-3 rounded text-gray-900"
                          value={hin.num}
                        />
                      </td>

                      <td className="border-solid border">
                        {mode === "check" && (hin.state == "" && (
                          <button className="bg-green-900 p-2 m-1 rounded " onClick={()=>changeHinmokuState(hin, "fin")}>
                            fin
                          </button>
                        ) || hin.state === "fin" && (
                          <>
                          <span>ok!</span>
                          <button className="bg-blue-300"  onClick={()=>changeHinmokuState(hin, "")}>cancel</button>
                          </>
                        ))}
                        {mode === "edit" && (
                          <>
                            <BtnAddNum hin={hin} num={1}></BtnAddNum>
                            <BtnAddNum hin={hin} num={5}></BtnAddNum>
                            <BtnAddNum hin={hin} num={-1}></BtnAddNum>
                            <BtnAddNum hin={hin} num={-5}></BtnAddNum>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                                </tbody>
              </table>
            </div>
          </>
        </div>
      )}

      <div className="three wide column text-left">© 2022 y</div>
    </div>
  )
}

export default Main
