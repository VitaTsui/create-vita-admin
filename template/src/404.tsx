// Result has no hsu-ui counterpart, so it falls back to antd; Button must come from hsu-ui
import { Result } from "antd";
import { Button } from "@hsu-react/ui";

import React from "react";
import { useNavigate } from "react-router";

const NoFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    ></Result>
  );
};

export default NoFoundPage;
