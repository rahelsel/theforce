import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ProgressiveImage from "react-progressive-image";
import * as helpers from '../../jss/helpers.js';
import { classTypeImgSrc } from '../../../site-settings.js';

const CoverDiv = styled.div`
    ${helpers.coverBg}
    transition: background-image 1s linear !important;
    background-position: center center;
    background-image: url('${props => props.coverSrc}');
    min-height: ${helpers.baseFontSize * 30}px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      opacity: 0.9;
      z-index: 0;
    }

    ${props => props.isEdit ? `@media screen and (max-width: ${helpers.tablet}px) {
      &:after {
        width: 0;
        height: 0;
        opacity: 0;
        background-color: transparent;
      }
    }` : ''};
`;

const ClassTypeCover = (props) => {
    if(props.itemScope && props.itemType) {
        return(
          <ProgressiveImage
          src={props.coverSrc}
          placeholder={config.blurImage}>
          {(src) => <CoverDiv coverSrc={src} itemScope itemType={props.itemType} isEdit={props.isEdit}>
            {props.children}
          </CoverDiv> }
        </ProgressiveImage>
         
        )
    }
    return(
      <ProgressiveImage
      src={props.coverSrc}
      placeholder={config.blurImage}>
      {(src) =>  <CoverDiv coverSrc={src} isEdit={props.isEdit}>
        {props.children}
      </CoverDiv>}
    </ProgressiveImage>
     
    )
  }

ClassTypeCover.propTypes = {
  coverSrc: PropTypes.string,
}

ClassTypeCover.defaultProps = {
  coverSrc: classTypeImgSrc
}

export default ClassTypeCover;
