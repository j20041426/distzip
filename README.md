# distzip

> Vue项目快速打包dist目录

该工具可以将项目中的dist目录打包成zip文件，方便后续的发布工作。

---

## 配置参数

`distzip.outPath` 打包好的zip文件所存放的目录，默认为系统桌面

`distzip.distPath` dist目录名称，默认为dist

zip包的命名默认为`package.json`文件中的`name`字段，也可以在`package.json`文件中增加`alias`字段来指定zip包的别名。