import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { withMobileDialog } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import PrimaryButton from '../buttons/PrimaryButton';
import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';


const styles = theme => {
  return {
    dialogRoot: {
      height: '100vh',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActionsRoot: {
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    dialogActions: {
      width: '100%',
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    googleButton: {
      minWidth: 150,
    },
    facebookButton: {
      minWidth: 150,
    },
  }
}
const DialogActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${helpers.rhythmDiv * 3}px;
  margin: 0;
  margin-top: ${helpers.rhythmDiv}px;
  width: 100%;
  flex-shrink: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    min-height: 100px
  }
`;

const DialogTitleContainer = styled.div`
  ${helpers.flexCenter};
  margin: 0 0 ${helpers.rhythmDiv * 2}px 0;
  padding: 0 ${helpers.rhythmDiv * 3}px;
`;

const DialogTitleWrapper = styled.h1`
  ${helpers.flexCenter};
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 100%;
  margin: 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 1.25}px;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: ${helpers.rhythmDiv + 'px'};
`;


const SignUpTypeDialogBox = (props) => (
  <Dialog
    fullScreen={props.fullScreen}
    open={props.open}
    onClose={props.onModalClose}
    onRequestClose={props.onModalClose}
    aria-labelledby="join"
    itemScope
    itemType="http://schema.org/CheckInAction"
    classes={{ root: props.classes.dialogRoot }}
  >
    <MuiThemeProvider theme={muiTheme}>

      <DialogTitleContainer>
        <DialogTitleWrapper>
          <span>Would you like to manage a school Listing?</span>
        </DialogTitleWrapper>
        <IconButton color="primary" onClick={props.onModalClose} classes={{ root: props.classes.iconButton }}>
          <ClearIcon />
        </IconButton>
      </DialogTitleContainer>

      <DialogActionWrapper>
        <ButtonWrapper>
          <PrimaryButton
            label="I manage a school"
            fullWidth={true}
            onClick={() => props.openSignUpModal("School")}
            textCenter
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <PrimaryButton
            label="I'm a student"
            fullWidth={true}
            onClick={() => props.openSignUpModal("Student")}
            textCenter
          />
        </ButtonWrapper>
      </DialogActionWrapper>
    </MuiThemeProvider>
  </Dialog>
)

SignUpTypeDialogBox.propTypes = {
  fullWidth: PropTypes.bool,
  open: PropTypes.bool,
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  openSignUpModal: PropTypes.func,
}

export default withMobileDialog()(withStyles(styles)(SignUpTypeDialogBox));