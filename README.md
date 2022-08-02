# shp-geojson (shpUtil)

shp 或 kmz 格式 与 GeoJSON 格式 互相转换工具类(shpUtil)

## 运行命令

### 首次运行前安装依赖

`npm install` 或 `cnpm install`

### 打包编译项目

运行`npm run build`来构建项目。

## 使用示例

### 安装及引入

安装包

```hash
npm install shp-geojson -save
```

引入包

```js
import * as shpUtil from 'shp-geojson'
//或者
//import { toGeoJSON } from 'shp-geojson'
```

### SHP 转 GeoJSON 示例：

```js
//直接加载url
shpUtil.toGeoJSON('//data.mars3d.cn/file/shp/test.zip').then((geojoson) => {
  console.log(geojoson)
})

//如果您以其他方式获得 zip（例如File API），则可以使用 arrayBuffer 调用
shpUtil.toGeoJSON(buffer).then((geojoson) => {
  console.log(geojoson)
})


```

 