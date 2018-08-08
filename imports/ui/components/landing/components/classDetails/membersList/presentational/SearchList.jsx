import React from "react";
import styled from "styled-components";

import { withStyles } from "material-ui/styles";
import Icon from "material-ui/Icon";
import TextField from "material-ui/TextField";
import {
  mobile,
  black,
  baseFontSize,
  rhythmDiv
} from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  display: flex;
  margin-left: ${rhythmDiv}px;

  @media screen and (max-width: ${mobile}px) {
    margin-left: 0;
    margin-bottom: ${rhythmDiv * 2}px;
  }
`;

const styles = {
  icon: {
    color: black,
    fontSize: baseFontSize * 1.5
  },
  inputRoot: {
    height: 18,
    fontSize: baseFontSize,
    fontStyle: "normal",
    fontWeight: 400
  }
};

const SearchList = props => (
  <Wrapper>
    <TextField
      value={props.searchedValue}
      InputProps={{ classes: { input: props.classes.inputRoot } }}
      onChange={props.onChange}
    />
    <Icon className={props.classes.icon}>{"search"}</Icon>
  </Wrapper>
);

export default withStyles(styles)(SearchList);
