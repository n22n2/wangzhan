import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css' // 全站样式（变量 / 重置 / 组件样式 / 响应式）

/* 将 App 挂载到 index.html 中 id="root" 的 div 上
   StrictMode：开发环境下二次渲染检查，帮助发现副作用问题（生产环境无影响）*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
