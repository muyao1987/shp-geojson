# shp-geojson (shpUtil)

shp 格式 与 GeoJSON 格式 互相转换工具类(shpUtil)

将 shapefile 相关数据（`.zip` 压缩包，或 `.shp`/`.dbf`/`.prj`/`.cpg` 文件）解析为 GeoJSON，支持通过 URL 或二进制数据（如 File API）加载，内置 proj4 及 CGCS2000（EPSG:4490~4554）系列坐标系定义。

## 特性

- 支持直接传入 zip 包链接、zip 二进制数据，或 `{ shp, dbf, cpg, prj }` 形式的对象
- 支持按基础地址分别请求 `.shp`/`.dbf`/`.prj`/`.cpg` 文件解析
- zip 包内支持多图层（多组 shp）及 GeoJSON 文件，返回数组
- 通过包内 `.prj`/`.cpg` 自动识别投影与编码，也可手动指定坐标系和编码
- 基于 proj4js 封装，内置 CGCS2000（2000 国家大地坐标系）系列 EPSG 定义（EPSG:4490~4554）

## 安装

```hash
npm install shp-geojson -save
```

## 引入方式

ESM 方式引入：

```js
import * as shpUtil from 'shp-geojson'
//或者
//import { toGeoJSON } from 'shp-geojson'
```

`dist` 目录下也提供了 UMD 版本（`shp-geojson-src.js` / 压缩版 `shp-geojson.js`），通过 `<script>` 标签引入后暴露全局变量 `shpUtil`。

## API 说明

| 方法 | 说明 |
| --- | --- |
| `toGeoJSON(base, whiteList, encoding, crs)` | 主入口。`base` 支持 URL 字符串、二进制数据或 `{ shp, dbf, cpg, prj }` 对象，返回 `Promise`，解析结果为 GeoJSON FeatureCollection（zip 内多图层时为数组）。`getShapefile` 为同一函数的原始名称 |
| `parseZip(buffer, whiteList, encoding, crs)` | 解析 zip 压缩包二进制数据，返回 `Promise` |
| `parseShp(shp, prj)` | 解析 `.shp` 二进制数据，返回 geometry 对象数组（不含属性） |
| `parseDbf(dbf, cpg)` | 解析 `.dbf` 二进制属性表，返回属性对象数组 |
| `combine([shp, dbf])` | 将几何数组与属性数组合并为 GeoJSON FeatureCollection |
| `getProj4(value)` | 获取 proj4 转换对象，优先使用页面全局的 `window.proj4` / `window.mars3d.proj4` |
| `getCrsList()` | 获取内置已注册的坐标系列表 |
| `proj4` | 转发导出的 proj4 实例（内置 CGCS2000 系列 EPSG 定义） |

## 使用示例

### SHP 转 GeoJSON 示例：

```js
//直接加载url
shpUtil.toGeoJSON('//data.mars3d.cn/file/shp/test.zip').then((geojson) => {
  console.log(geojson)
})

//如果您以其他方式获得 zip（例如File API），则可以使用 arrayBuffer 调用
shpUtil.toGeoJSON(buffer).then((geojson) => {
  console.log(geojson)
})
```

### 指定编码和坐标系：

```js
shpUtil.toGeoJSON('http://example.com/data/test.zip', [], 'gbk', 'EPSG:4490').then((geojson) => {
  console.log(geojson)
})
```

## 运行命令

### 首次运行前安装依赖

`npm install` 或 `cnpm install`

### 打包编译项目

运行`npm run build`来构建项目。

## 目录结构

```
shp-geojson
├── dist/                 # 构建产物（UMD 版本）
├── src/                  # 源码
│   ├── index.js          # 入口，对外 API 定义
│   ├── binaryajax.js     # 远程文件请求
│   ├── combine.js        # URL 扩展名拼接
│   ├── parseShp.js       # shp 二进制解析
│   ├── proj4.js          # proj4 封装及 CGCS2000 坐标系定义
│   └── unzip.js          # zip 压缩包解压
├── rollup.config.js      # rollup 构建配置
└── package.json
```

## 版权及说明

本项目由 [火星科技](http://marsgis.cn/) 木遥(muyao1987) 开发维护，示例数据来自 [Mars3D](https://mars3d.cn) 平台。

- 项目主页：<https://github.com/muyao1987/shp-geojson>
- 问题反馈：<https://github.com/muyao1987/shp-geojson/issues>

## 许可证

[Apache-2.0](LICENSE)
