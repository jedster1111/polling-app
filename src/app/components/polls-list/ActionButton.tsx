import { Button, Icon } from "antd";
import { ButtonType } from "antd/lib/button";
import * as React from "react";

const ActionButton: React.SFC<{
  iconType: string;
  text: string;
  handleClick?: () => void;
  buttonType?: ButtonType;
  link?: boolean;
  block?: boolean;
  className?: string;
}> = ({ iconType, text, handleClick, buttonType, link, block, className }) => {
  const actionButtonTemplate = (
    <Button
      onClick={handleClick}
      type={buttonType || "default"}
      block={block}
      className={className}
    >
      {text}
      {<Icon type={iconType} style={{ marginRight: 8 }} />}
    </Button>
  );
  const button = link ? <a>{actionButtonTemplate}</a> : actionButtonTemplate;
  return button;
};

export default ActionButton;
