import proj4 from "proj4"
export { proj4 }

// China Geodetic Coordinate System 2000
proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs")

// Zone横坐标前加带号， 6度分带

// CGCS2000 / Gauss-Kruger zone 13, bounds : 73.62 35.42 78.01 41.07
proj4.defs("EPSG:4491", "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=13500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 14, bounds : 77.98 29.16 84.0 47.23
proj4.defs("EPSG:4492", "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=14500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 15, bounds :84.0 27.32 90.0 49.18
proj4.defs("EPSG:4493", "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=15500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 16, bounds :90.0 27.71 96.01 47.9
proj4.defs("EPSG:4494", "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=16500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 17
proj4.defs("EPSG:4495", "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=17500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 18
proj4.defs("EPSG:4496", "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=18500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 19
proj4.defs("EPSG:4497", "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=19500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 20
proj4.defs("EPSG:4498", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=20500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 21
proj4.defs("EPSG:4499", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=21500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 22
proj4.defs("EPSG:4500", "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=22500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger zone 23
proj4.defs("EPSG:4501", "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=23500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")

// Zone 横坐标前加带号， 3度分带

// CGCS2000 / 3-degree Gauss-Kruger zone 25 , bounds:  73.62 35.81  76.5 40.65
proj4.defs("EPSG:4513", "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 26 , bounds:  76.5 31.03  79.5 41.83
proj4.defs("EPSG:4514", "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=26500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 27 , bounds:  79.5 29.95 82.51 45.88
proj4.defs("EPSG:4515", "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=27500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 28
proj4.defs("EPSG:4516", "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=28500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 29
proj4.defs("EPSG:4517", "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=29500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 30
proj4.defs("EPSG:4518", "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=30500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 31
proj4.defs("EPSG:4519", "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=31500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 32
proj4.defs("EPSG:4520", "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=32500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 33
proj4.defs("EPSG:4521", "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=33500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 34
proj4.defs("EPSG:4522", "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=34500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 35
proj4.defs("EPSG:4523", "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=35500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 36
proj4.defs("EPSG:4524", "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=36500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 37
proj4.defs("EPSG:4525", "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 38
proj4.defs("EPSG:4526", "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=38500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 39
proj4.defs("EPSG:4527", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 40
proj4.defs("EPSG:4528", "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 41
proj4.defs("EPSG:4529", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=41500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 42
proj4.defs("EPSG:4530", "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=42500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 43
proj4.defs("EPSG:4531", "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=43500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 44
proj4.defs("EPSG:4532", "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=44500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger zone 45
proj4.defs("EPSG:4533", "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=45500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")

// CM 横坐标前不加带号， 6度分带

// CGCS2000 / Gauss-Kruger CM 75E
proj4.defs("EPSG:4502", "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 81E
proj4.defs("EPSG:4503", "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 87E
proj4.defs("EPSG:4504", "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 93E
proj4.defs("EPSG:4505", "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 99E
proj4.defs("EPSG:4506", "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 105E
proj4.defs("EPSG:4507", "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 111E
proj4.defs("EPSG:4508", "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 117E
proj4.defs("EPSG:4509", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 123E
proj4.defs("EPSG:4510", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 129E
proj4.defs("EPSG:4511", "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / Gauss-Kruger CM 135E
proj4.defs("EPSG:4512", "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")

// CM 横坐标前不加带号， 3度分带

// CGCS2000 / 3-degree Gauss-Kruger CM 75E, bounds: 73.62 35.81 76.5 40.65
proj4.defs("EPSG:4534", "+proj=tmerc +lat_0=0 +lon_0=75 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 78E, bounds: 76.5 31.03 79.5 41.83
proj4.defs("EPSG:4535", "+proj=tmerc +lat_0=0 +lon_0=78 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 81E, bounds: 79.5 29.95 82.51 45.88
proj4.defs("EPSG:4536", "+proj=tmerc +lat_0=0 +lon_0=81 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 84E
proj4.defs("EPSG:4537", "+proj=tmerc +lat_0=0 +lon_0=84 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 87E
proj4.defs("EPSG:4538", "+proj=tmerc +lat_0=0 +lon_0=87 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 90E
proj4.defs("EPSG:4539", "+proj=tmerc +lat_0=0 +lon_0=90 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 93E
proj4.defs("EPSG:4540", "+proj=tmerc +lat_0=0 +lon_0=93 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 96E
proj4.defs("EPSG:4541", "+proj=tmerc +lat_0=0 +lon_0=96 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 99E
proj4.defs("EPSG:4542", "+proj=tmerc +lat_0=0 +lon_0=99 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 102E
proj4.defs("EPSG:4543", "+proj=tmerc +lat_0=0 +lon_0=102 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 105E
proj4.defs("EPSG:4544", "+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 108E
proj4.defs("EPSG:4545", "+proj=tmerc +lat_0=0 +lon_0=108 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 111E
proj4.defs("EPSG:4546", "+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 114E
proj4.defs("EPSG:4547", "+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 117E
proj4.defs("EPSG:4548", "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 120E
proj4.defs("EPSG:4549", "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 123E
proj4.defs("EPSG:4550", "+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 126E
proj4.defs("EPSG:4551", "+proj=tmerc +lat_0=0 +lon_0=126 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 129E
proj4.defs("EPSG:4552", "+proj=tmerc +lat_0=0 +lon_0=129 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 132E
proj4.defs("EPSG:4553", "+proj=tmerc +lat_0=0 +lon_0=132 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")
// CGCS2000 / 3-degree Gauss-Kruger CM 135E
proj4.defs("EPSG:4554", "+proj=tmerc +lat_0=0 +lon_0=135 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs")


export function getProj4(value) {
  if (window.proj4) {
    return window.proj4(value)
  }
  if (window.mars3d && window.mars3d.proj4) {
    return window.mars3d.proj4(value)
  }
  return proj4(value)
}

// 获取内部支持的坐标系列表
export function getCrsList () {
  const arr = []
  for (const key in proj4.defs) {
    if (key.startsWith("EPSG:")) {
      arr.push({ crs: key, ...proj4.defs[key] })
    }
  }
  return arr
}
