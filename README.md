# 技术栈
+  React + TypeScript + Vite
+  无状态管理库 使用Context管理  

## 项目描述


## 组件开发

### 形态

大致分成三种形态
1. 设计态组件：指的是拖拉拽那一套构建页面的逻辑 对应的组件是`FormDesign`
2. 可以编辑的预览态组件：指的是构建页面完毕，然后根据构建页面的json结构进行渲染，应用于审批的填报 对应的组件是 `FormLityRender `
3. 不可编辑的预览态组件：指的是最终审批表单的预览 对应的组件是`FormLityPreview`和`FormLityPrint`

### 各个形态入口

1. 设计态 左侧注册(物料)的地方在这里：src\ui\PanelSpace\default.tsx 
2. 设计态 右侧注册(属性配置)的地方在这里：src\ui\SettingSpace\SettingComponents\index.ts。用来控制设计态左侧对应的组件能够配置什么属性
3. 预览态：src\core\createSchemaField\index.ts，

### 根据 可见性 过滤 value

见 `filterVisibleValues`

### 开发示例

用 `src\components\Rate` 这个组件举例子，大概说一下组件编写的时候需要注意的地方
1. 注意区分设计态和预览态， `const RateComp = connect(Rate, mapReadPretty(preview));` 中， 前者是设计态与可以编辑的预览态，后者是不可编辑的预览态
2. 预览态：分成两种模式，普通预览模式和打印模式，其中打印模式可以 使用 `const { printMode } = useFormiltyConfigContext();` 然后进行区分，true是打印模式，接受的prop是设计态onchange的变量
3. 可以编辑的预览态：接受的prop中有一个onChange，在设计态onchange更改了之后，一定要通过接受的prop.onchange暴露出去
4. 设计态：见 src\ui\SettingSpace\SettingComponents\RateSetting 这个文件，配置了可以设计的地方，通过递归渲染，自定义逻辑的情况把value绑定在 Form.Item 里面就好了

## 设计说明 




### 预览过滤空值

见`filterSchemaProperties`



### 关于显隐规则

1. `handleFieldPermission` 流程显隐
2. `getAllLinkageCondition` 字段配置`显隐规则`显隐


### 关于样式隔离

由于存在父组件将子组件的样式隔离的组件都覆盖掉的场景, 因此 `vite-plugin-css-modules-important` 插件被引入, 使用时在 `vite.config.ts` 中配置，能够把 `:global`的所有类名都加上 `!important` 属性

因此在该包的开发中不需要再手动在 `:global` 的类名上添加 `!important` 属性, 不然会冲突

 
### 关于权限

注意: 组件只读不做校验

- hidden 隐藏
- readonly 只读
- editable 可编辑


useFlitySate 中传入 `useFlitySate` 即可, 注意 `表格`中间用.分割

示例如下
```
fieldPermissions: [{
    hidden: true,
    field: "table-26.input-6"
},{
    readonly: true,
    field: "table-174.input-174099"
},]
```
代码中用 `handleFieldPermission` 处理, table 中 有其特殊处理逻辑


### 关于校验

由于校验数据受到权限和table数据结构的影响, 除了 `formity` 的校验外，`src\core\components\FormLityRender\index.tsx` 的 `valiateForm` 存放自定义校验逻辑，在submit中会触发自定义校验


### 关于唯一标识

用 alias 作为假的 唯一key
组件： `DraftKeySetting`



## Todo

* 移除loadsh、ant-design的构建。
* 调整模块类型导出。
