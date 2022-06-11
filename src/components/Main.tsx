import { useEffect, useState } from "react"
import { useHistory } from "react-router"
// import json from './commands.json'
import { RadioItems } from "./Radio"
import { handleWithSave, useLoad } from "../utils"
import { handleToggleWithSave } from "./../utils"
import Hinmoku from "./Hinmoku"

const OPTION_BTN_CLASS = "bg-gray-600 rounded p-1"

function getStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    return null
  }
}
function setStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {}
}

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

type Hinmoku = {
  hinsyu: Hinsyu
  label: string
  num: string
}

type Shop = {
  label: string
  hinmokus: Hinmoku[]
}

const def_labels = [
  "トオカツ",
  "シノブ",
  "酵母パン",
  "第一パン",
  "敷島製パン",
  "伊藤パン",
  "フジパン",
  "神戸屋",
  "Kアイス",
  "ナシオ",
  "国分常温",
]

const def_labels_chilled = ["チルド", "トオカツ", "デリア", "三桂"]

const makeHinmokus = (hinsyu: Hinsyu, labels: string[]): Hinmoku[] =>
  labels.map((label) => ({ hinsyu, label, num: "" }))

const def_hinmokus = def_labels.map((label) => ({ label, num: "" }))

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

  const history = useHistory()
  const title = "生協"
  useEffect(() => {
    document.title = title
  }, [history.location, title])

  const test = () => {}

  const setHinmokuNum = (hin: Hinmoku, cb: (pre: string) => string) => {
    if (!selectedShop) return
    setShops((shops) => {
      return shops.map((shop) => {
        if (shop.label === selectedShop.label) {
          const new_shop = {
            label: shop.label,
            hinmokus: shop.hinmokus.map((h) => {
              const new_hinmoku = {
                ...h
              }
              if (h.label === hin.label) {
                const new_num = cb(h.num)
                console.log('new_num', new_num);
                
                new_hinmoku.num = new_num
                console.log('new_hinmoku', new_hinmoku);
                return new_hinmoku
              }
              
              return h
            })
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
        label,
        hinmokus: makeHinmokus("jouon", def_labels),
      },
    ])
    console.log("new_shops", new_shops)
    setShops(new_shops)
    setInputShopName("")
  }

  useEffect(() => {
    const name = def_shop_names.find((s) => s[0] === selectShopName)
    if (!name) return
    setInputShopName(name[1])
  }, [selectShopName])

  return (
    <div className="App p-5">
      <h1 className="text-3xl p-1 text-center">{title}</h1>

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
              return <option value={name[0]}>{name[1]}</option>
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

      {/* 大学名一覧 */}
      {!selectedShop &&
        shops.map((shop) => {
          return (
            <div>
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
                {selectedShop.hinmokus.map((hin) => {
                  return (
                    <tr>
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
                        {mode === "check" && (
                          <button className="bg-green-900 p-2 m-1 rounded " onClick={test}>
                            fin
                          </button>
                        )}
                        {mode === "edit" && (
                          <>
                            <button className="bg-green-900 p-2 m-1 rounded " onClick={() => handleAddNum(hin, 1)}>
                              +1
                            </button>
                            <button className="bg-green-900 p-2 m-1 rounded " onClick={() => handleAddNum(hin, 5)}>
                              +5
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </table>
            </div>
          </>
        </div>
      )}

      <div className="three wide column text-left">© 2022 yokoyama</div>
    </div>
  )
}

export default Main
