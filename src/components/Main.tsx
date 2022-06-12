import { useEffect, useState } from "react"
import { useHistory } from "react-router"
// import json from './commands.json'
// import Hinmoku from "./Hinmoku"

function load(key: string): any {
  try {
    const ret = localStorage.getItem(key)
    if (typeof ret === "string") return JSON.parse(ret)
    return null
  } catch (error) {
    return null
  }
}
function save(key: string, value: any): void {
  console.log("save...")
  try {
    localStorage.setItem(key, JSON.stringify(value))
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

const def_labels_chilled = [
  ["c-chilled", "チルド"],
  ["c-tokatu", "トオカツ"],
  ["c-delia", "デリア"],
  ["c-sankei", "三桂"],
]

const makeHinmokus = (hinsyu: Hinsyu, labels: string[][]): Hinmoku[] =>
  labels.map(([id, label]) => ({ id, hinsyu, label, num: "", state: "" }))

const def_shop_names: string[][] = [
  ["", ""],
  ["keiou_sinano", "慶応信濃町"],
  ["keiou_mita", "慶応義塾大学 三田購買部"],
  ["keiou_kyouritu", "慶応義塾大学芝共立キャンパス"],
  ["keiou_josi", "慶應女子高"],
  ["kango", "日本赤十字看護大学"],
  ["twins", "早稲田twins"],
  ["meiji_sirogane", "明治学院白金"],
  ["hosiyakka", "星薬科大学"],
  ["kaiyou", "海洋大学"],
  ["rika", "理科大学 神楽坂店"],
  ["housei_iti", "法政大学 市ヶ谷購買書籍部"],
]

// 編集モード：品目の数量編集するモード
// チェックモード：数量通りの確認作業モード

type Mode = "edit" | "check"

const Main: React.FC<{ lang: string }> = ({ lang }) => {
  const STORAGE_KEY = "shops"
  const [inputShopName, setInputShopName] = useState("")
  const [selectShopName, setSelectShopName] = useState("")
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [mode, setMode] = useState<Mode>("edit")
  const [showOptional, setShowOptional] = useState(false)

  const history = useHistory()
  const title = "生協"

  // 初期処理
  useEffect(() => {
    console.log("load...")

    const value = load(STORAGE_KEY)
    console.log("value", value)

    if (value === undefined || value === null) return
    try {
      setShops(value)
    } catch (e) {
      console.log("setShop error on load value.")
    }
  }, [])

  useEffect(() => {
    document.title = title
  }, [history.location, title])

  // データ更新があったらセーブする
  useEffect(() => {
    save(STORAGE_KEY, shops)
  }, [shops])

  // 指定品目の更新
  const changeSelectedShopHinmoku = (hin: Hinmoku, cb: (h: Hinmoku) => Hinmoku) => {
    if (!selectedShop) return
    setShops((shops) => {
      return shops.map((shop) => {
        if (shop.label !== selectedShop.label) return shop
        const new_shop = {
          ...shop,
          hinmokus: shop.hinmokus.map((h) => {
            if (h.id !== hin.id) return h
            const new_hinmoku = cb(h)
            console.log("new_hinmoku", new_hinmoku)
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
        state,
      }
    })
  }
  const setHinmokuNum = (hin: Hinmoku, cb: (pre: string) => string) => {
    changeSelectedShopHinmoku(hin, (preHinmoku) => {
      return {
        ...preHinmoku,
        num: cb(preHinmoku.num),
      }
    })
  }
  const clearHinmokuNum = (hin: Hinmoku) => {
    changeSelectedShopHinmoku(hin, (preHinmoku) => {
      return {
        ...preHinmoku,
        num: "",
      }
    })
  }
  // React.InputHTMLAttributes<HTMLInputElement>.onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  const handleChangeHinmokuNum = (hin: Hinmoku, value: string) => {
    setHinmokuNum(hin, (pre) => value)
  }

  const handleAddNum = (hin: Hinmoku, num: number) => {
    setHinmokuNum(hin, (pre: string) => {
      console.log("pre", pre, "num", num)
      const _pre = !pre ? 0 : +pre
      const new_value = "" + (_pre + num)
      console.log("new_value", new_value)

      return new_value
    })
  }
  const addShop = (label: string) => {
    console.log("addShop", label)

    if (!label) return

    // すでに追加済み大学は処理キャンセル
    if (shops.find((s) => s.label === label)) return

    const new_shops = shops.concat([
      {
        id: "shop_" + Date.now(),
        label,
        hinmokus: makeHinmokus("jouon", def_labels).concat(makeHinmokus("chilled", def_labels_chilled)),
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
    <button className="bg-green-900 p-2 m-1 rounded " onClick={() => handleAddNum(hin, num)}>
      {num >= 0 ? "+" : ""}
      {num}
    </button>
  )
  const BtnClearNum: React.FC<{
    hin: Hinmoku
  }> = ({ hin, children }) => (
    <button className="bg-blue-500 p-2 m-1 rounded float-right" onClick={() => clearHinmokuNum(hin)}>
      C
    </button>
  )

  const selectedHinmokus = () => {
    if (!selectedShop) return []
    const hinmokus = shops.find((s) => s.id === selectedShop.id)!.hinmokus
    if (mode === "check") return hinmokus.filter((h) => h.num !== "")
    return hinmokus
  }

  const hinmokusTotal = (hinmokus: Hinmoku[]) => {
    return hinmokus
      .filter((h) => h.num !== "")
      .map((h) => h.num)
      .reduce((a, b) => +a + +b, 0)
  }
  const selectedTotalNum = () => {
    if (!selectedShop) return 0
    const hinmokus = shops.find((s) => s.id === selectedShop.id)!.hinmokus
    return hinmokusTotal(hinmokus)
  }
  const shopHinmokuTotal = (shop: Shop) => {
    return hinmokusTotal(shop.hinmokus)
  }

  const TableHinmokus: React.FC<{
    label: string
    hinmokus: Hinmoku[]
  }> = ({ label, hinmokus, children }) => (
    <div className="">
      <div className="mt-2 text-2xl">
        {label}({hinmokusTotal(hinmokus)})
      </div>
      <table className="hinmoku">
        <tbody>
          {hinmokus.map((hin, index) => {
            return (
              <tr key={hin.id}>
                <td className="border-solid border">{hin.label}</td>
                <td className="border-solid border">
                  {mode === "edit" && (
                    <input
                      type="number"
                      onChange={(e) => handleChangeHinmokuNum(hin, e.target.value)}
                      className="num border p-3 rounded text-gray-900"
                      value={hin.num}
                    />
                  )}
                  {mode === "check" && <span className="p-3 text-xl">{hin.num}</span>}
                </td>

                <td className="border-solid border">
                  {mode === "check" &&
                    ((hin.state == "" && (
                      <button className="bg-green-900 p-2 m-1 rounded " onClick={() => changeHinmokuState(hin, "fin")}>
                        fin
                      </button>
                    )) ||
                      (hin.state === "fin" && (
                        <>
                          <span>ok!</span>
                          <button className="bg-blue-300 m-3" onClick={() => changeHinmokuState(hin, "")}>
                            cancel
                          </button>
                        </>
                      )))}
                  {mode === "edit" && (
                    <>
                      <BtnAddNum hin={hin} num={1}></BtnAddNum>
                      <BtnAddNum hin={hin} num={5}></BtnAddNum>
                      {!showOptional && (
                        <>
                          <BtnAddNum hin={hin} num={-1}></BtnAddNum>
                          <BtnAddNum hin={hin} num={-5}></BtnAddNum>
                        </>
                      )}
                      {showOptional && <BtnClearNum hin={hin}></BtnClearNum>}
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="App p-5">
      <h1 className="text-3xl p-1 text-center" id="title">{title}</h1>

      {!selectedShop && (
        <div id="add-shop-area" className="border rounded p-2">
          {/* 大学名プルダウン */}
          <div className="">
            大学の追加
          </div>
          <select
            className="text-black p-3 my-3"
            value={selectShopName}
            onChange={(e) => {
              const value = e.target.value
              console.log("value", value)
              setSelectShopName(value)
              console.log("selectShopName", selectShopName)
            }}
          >
            {def_shop_names.map((name) => {
              return (
                <option value={name[0]} key={name[0]}>
                  {name[1]}
                </option>
              )
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
          <button className="bg-green-900 p-2 my-1 rounded " onClick={() => addShop(inputShopName)}>
            大学追加
          </button>
        </div>
      )}

      {/* <div>mode: {mode}</div> */}

      {selectedShop && <></>}

      {/* 大学名一覧 */}
      {!selectedShop && (

      <div id="shops-list" className="border rounded my-2 py-2">
        <div className="p-2">
          <span>

          大学一覧({shops.length})
          </span>
          <span className="float-right">
            total: {shops.map((s) => shopHinmokuTotal(s)).reduce((a, b) => a + b, 0)}
          </span>
        </div>
        {
          shops.map((shop) => {
            return (
              <div key={shop.id} className="my-2">
                <button className="bg-green-900 p-2 m-1 rounded " onClick={() => setSelectedShop(shop)}>
                  {shop.label}(
                  {shop.hinmokus
                    .filter((h) => h.num !== "")
                    .map((h) => h.num)
                    .reduce((a, b) => +a + +b, 0)}
                  )
                </button>
                <button
                  className="bg-red-900 p-2 m-1 rounded float-right"
                  onClick={() => setShops((shops) => shops.filter((s) => s.id !== shop.id))}
                >
                  del
                </button>
              </div>
            )
          })}
      </div>

      )}

      {/* 選択された大学 */}
      {selectedShop && (
        <div>
          <>
            <div className="relative">
              <div className="opacity-100 z-50 text-xl fixed  top-0 left-0 right-0 bg-blue-900 p-3">
                <div>
                  {selectedShop.label}({selectedTotalNum()})
                </div>
                <button className="right-0 float-right" onClick={() => setSelectedShop(null)}>
                  return
                </button>
              </div>
            </div>

            <div id="table-area" className="relative mt-9">
              <div className="m-5">
                <label htmlFor="">
                  show optional
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    checked={showOptional}
                    onChange={(e) => setShowOptional(e.target.checked)}
                  />
                </label>
              </div>
              <button className="bg-green-900 p-2 m-1 rounded " onClick={() => setMode("edit")}>
                to edit mode
              </button>
              <button className="bg-green-900 p-2 m-1 rounded " onClick={() => setMode("check")}>
                to check mode
              </button>
              <TableHinmokus
                label="常温"
                hinmokus={selectedHinmokus().filter((h) => h.hinsyu === "jouon")}
              ></TableHinmokus>
              <TableHinmokus
                label="チルド"
                hinmokus={selectedHinmokus().filter((h) => h.hinsyu === "chilled")}
              ></TableHinmokus>
            </div>
          </>
        </div>
      )}

      <div className="three wide column text-left mt-5">© 2022</div>
    </div>
  )
}

export default Main
