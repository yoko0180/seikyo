# 生協個数チェックページ

大学：shop

データ：shops

大学選択：selectedShop

データ更新はオブジェクト、配列ともに新しく作り直す

```
shops <- 参照 -- selectedShop
の状態で、shopsを更新、つまり作り直すとselectedShopとは別になる。
更新されたデータも表示できる一意のデータとして表示するにはselectedShopを表示するのではなく
selectedShopされたものが示す本データをshopsから取り出すように表示する必要がある。
これができていなくて散々時間を消費してしまったので注意する。
```


