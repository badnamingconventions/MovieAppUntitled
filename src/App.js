import React from "react";
import EntitySelector from "./components/EntitySelector";
import "antd/dist/antd.css";
import "./App.css";
import { Row, Col } from "antd";

function App() {
  return (
    <div className="App">
      <Row className="App-header">
        <Col span={6}>
          <EntitySelector />
        </Col>
        {/* Right side selector
        <Col span={6} offset={12}>
          <EntitySelector />
        </Col> */}
      </Row>
    </div>
  );
}

export default App;
