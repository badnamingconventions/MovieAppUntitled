import React from "react";
import EntitySelector from "./components/EntitySelector";
import "antd/dist/antd.css";
import "./App.css";
import { Row, Col, Layout } from "antd";

const { Header, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <Row>
            <Col span={6}>
              <EntitySelector />
            </Col>
            {/* Right side selector */}
            {/* <Col span={6} offset={12}>
              <EntitySelector />
            </Col> */}
          </Row>
        </Header>
        <Content>
            
        </Content>
      </Layout>
    </div>
  );
}

export default App;
