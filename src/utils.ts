import { ChangeEventHandler, useState } from "react"

// export const isDebug = process.env.DEBUG === '1'
export const isDebug = true

export const debugLog = (...msg: any) => isDebug && console.log(...msg)

// !!! localStorageは文字列で保存される
// boolean型などでロードしたい場合は文字列をパースする必要がある

function save(key: string, value: any) {
  debugLog('* save ' + key, value)
  localStorage.setItem(key, value)
}
function load(key: string, defaultValue:any) {
  const ret: string | null = localStorage.getItem(key)
  debugLog('* load', key, ret)
  return ret === undefined || ret === null ? defaultValue : ret
}

export function handleWithSave(key: string, setter: React.SetStateAction<any>): ChangeEventHandler<HTMLInputElement> {
  return (e) => {
    debugLog('* handleWithSave ' + key)
    setter(e.target.value)
    save(key, e.target.value)
  }
}
export function handleToggleWithSave(key: string, setter: React.SetStateAction<any>): ChangeEventHandler<HTMLInputElement> {
  return () => {
    setter((current:any) => {
      save(key, !current)
      return !current
    })
  }
}

type CreateHandler = (key: string, setter: React.SetStateAction<any>)=> ChangeEventHandler<HTMLInputElement>

// オプション値用のstateとハンドル生成（共通の処理枠：value値やトグルによってハンドル内容は異なるためハンドルクリエーターは指定のものを使う）
// state生成と初期表示のロード処理をする
// 指定のハンドルクリエーターでハンドル作成
export function useLoad<T>(storageKey: string, createHandler: CreateHandler, defaultValue: T):[T, ChangeEventHandler<HTMLInputElement>] {
  const loadValue = load(storageKey, defaultValue)
  debugLog('* useLoad ' + storageKey, loadValue)

  let _default = loadValue
  if (typeof defaultValue === "boolean") {
    _default = loadValue === "true" || loadValue === true ? true : false
  }
  debugLog('* useLoad _default ' + storageKey, _default)

  const [value , setter] = useState( _default ) // ハンドリングに必要な一時的な状態保持値を用意
  const handle = createHandler(storageKey, setter)
  return [value, handle]
}