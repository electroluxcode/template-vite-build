import { ConfigProvider, Card, Avatar } from 'antd'
import {Plugin} from './plugin'
export const App = () => {
  return (
      <div>
        app
        <ConfigProvider prefixCls="zptest-prefix23"> 
          <Plugin />
        </ConfigProvider>
      </div>
  )
}