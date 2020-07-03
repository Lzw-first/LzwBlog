import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Main, Footer, Aside, Menu, MenuItem, Submenu, MessageBox, Card, Row, Col } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$alert = MessageBox.alert
