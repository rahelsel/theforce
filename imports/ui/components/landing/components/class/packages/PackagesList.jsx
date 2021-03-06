import React, { Fragment } from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Package from './Package';

import PackageStructure from '../../../constants/structure/package.js';

import * as helpers from '../../jss/helpers.js';
import { SubHeading } from '../../jss/sharedStyledComponents';

const PACKAGE_WIDTH = 500;
const PACKAGE_TYPE_CATEGORIES = ['payAsYouGo', 'autoWithDraw', 'payUpFront'];
const packageTypeCategories = {
    'payAsYouGo': 'Pay As You Go',
    'autoWithDraw': 'Automatic Withdrawal',
    'payUpFront': 'Pay Up Front'
}

const PACKAGE_LIST_STYLES = {
    enrollmentPackages: {
        bgColor: '#ddd',
        opacity: 0.1
    },
    classPackages: {
        bgColor: helpers.primaryColor,
        opacity: 0.1
    },
    monthlyPackages: {
        bgColor: helpers.panelColor,
        opacity: 1
    }
}

const Wrapper = styled.div`
	width: 100%;
	${helpers.flexCenter}
	flex-direction: column; 

	@media screen and (max-width: ${helpers.tablet}px) {
		${helpers.flexDirectionColumn};
	}
`;

const PackagesListWrapper = styled.section`
	width: 100%;
	position: relative;
	z-index: 1;
	// align-items: ${(props) => (props.classPackages ? 'flex-end' : 'flex-start')};
	align-items: center;
	padding: ${helpers.rhythmDiv * 4}px 0;
	${props => props.fullScreen && `width: 100%; align-items: center`};
    ${props => props.onPriceEdit && 'flex-direction: row;flex-wrap: wrap;justify-content: space-around;'} 
	
	&:after {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
        z-index: 0;
        
		background-color: ${props => PACKAGE_LIST_STYLES[props.listType].bgColor};
		opacity: ${props => PACKAGE_LIST_STYLES[props.listType].opacity};
		${(props) => (props.variant === 'light' ? 'background-color: transparent' : '')};
	}

	@media screen and (max-width: ${helpers.tablet}px) {
		width: 100%;
        align-items: center;
        margin: 0 auto;
	}
`;

// const EnrollMentListWrapper = PackagesListWrapper.extend`
// 	${(props) => props.onPriceEdit && 'flex-direction: row;flex-wrap: wrap;justify-content: space-around;'} 

// 	&::after {
// 		background-color: #dddd;
// 		${(props) => (props.variant === 'light' ? 'background-color: transparent' : '')};
// 		opacity: 1;
// 	}
// `;


const PackagesWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.classPackages ? 'flex-end' : 'flex-start')};
  padding: 0 ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 1;
  ${props => props.onPriceEdit &&
        `flex-direction: row; 
    flex-wrap: wrap; 
    justify-content: space-around;`}

  @media screen and (max-width: ${helpers.tablet}px) {
  	max-width: ${PACKAGE_WIDTH}px;
    padding: ${helpers.rhythmDiv}px;
    align-items: space-around;
    margin: 0 auto;
  }
`;

const PackagesContainer = styled.div`
	${helpers.flexCenter}  
	flex-wrap: wrap;
	justify-content: ${props => props.packagesLength > 1 ? 'space-between' : 'center'}; 
    width: 100%;
	max-width: ${PACKAGE_WIDTH * 2 + helpers.rhythmDiv * 4}px;
	margin: 0 auto;

	@media screen and (max-width: ${PACKAGE_WIDTH * 2 + helpers.rhythmDiv * 4}px) {
		max-width: ${PACKAGE_WIDTH}px;
	}
`;

const PackageWrapper = styled.div`
	margin-bottom: ${helpers.rhythmDiv * 2}px;
	max-width: ${PACKAGE_WIDTH}px;
	width: 100%;
`;

const Title = styled.h2`
	font-family: ${helpers.specialFont};
	font-weight: 300;
	text-align: center;
	font-style: italic;
	line-height: 1;
	font-size: ${helpers.baseFontSize * 1.5}px;
	margin: 0;
	margin-bottom: ${helpers.rhythmDiv * 4}px;
	color: ${helpers.textColor};
	width: 100%;
`;

const PackageTypeTitle = SubHeading.extend`
    font-size: 20px;
    font-weight: 400;
    width: 100%;
	max-width: ${PACKAGE_WIDTH * 2 + helpers.rhythmDiv * 4}px;
    margin: 0 auto;
    margin-bottom: ${helpers.rhythmDiv}px;
    ${props => props.packagesData.length === 1 && 'max-width: 500px'};
    
    @media screen and (max-width: ${PACKAGE_WIDTH * 2 + helpers.rhythmDiv * 4}px) {
		max-width: ${PACKAGE_WIDTH}px;
    }
    
    @media screen and (max-width: ${helpers.mobile}px) {
        text-align: center;
    }
`;

const Packages = (props) => (
    <PackagesContainer packagesLength={props.packagesData.length}>
        {props.packagesData.map((packageData) => (
            <PackageWrapper key={packageData._id}>
                <Package
                    {...packageData}
                    {...props.packageProps}
                    classPackages={props.classPackages}
                    schoolCurrency={props.schoolCurrency}
                    onSchoolEdit={props.onSchoolEdit}
                    onEditClick={() => {
                        props.onEditClick();
                    }}
                    setFormData={() => {
                        props.setFormData(packageData);
                    }}
                />
            </PackageWrapper>
        ))}
    </PackagesContainer>
);

const PackagesListContainer = (props) => (
    <React.Fragment>
        {/*console.log(".....", props.monthlyPackagesData)*/}
        < PackagesListWrapper
            listType={props.listType}
            variant={props.variant}
            fullScreen={props.fullScreen}
            classPackages={props.classPackages}
        >
            <PackagesWrapper
                classPackages={props.classPackages}
                onPriceEdit={props.onPriceEdit}>
                <Title>{props.packageListName}</Title>
                {props.listType === 'monthlyPackages' ?
                    Object
                        .keys(props.packagesData)
                        .map(pymtType => {
                            const packages = props.packagesData[pymtType].packages;
                            return (<React.Fragment>
                                {!isEmpty(packages) &&
                                    <React.Fragment>
                                        <PackageTypeTitle
                                            packagesData={props.packagesData[pymtType].packages}
                                        >{packageTypeCategories[pymtType]}</PackageTypeTitle>
                                        <Packages
                                            {...props}
                                            packagesData={props.packagesData[pymtType].packages} />
                                    </React.Fragment>}
                            </React.Fragment>)
                        })
                    :
                    <Packages {...props} />}
            </PackagesWrapper>
        </PackagesListWrapper >
    </React.Fragment>
);

const categorizeMonthlyListData = (packagesData) => {
    const categorizedData = {};
    const categories = PACKAGE_TYPE_CATEGORIES.forEach(category => {
        categorizedData[category] = {
            name: category,
            packages: []
        };
    });

    //console.info(categorizedData, 'before adding packages');
    packagesData.forEach(packageData => {
        const paymentType = packageData.pymtType;
        Object.keys(paymentType).forEach(type => {
            const category = paymentType[type];
            //console.log(category, type, paymentType);
            if (category) {
                //console.log(category, type, "....");
                categorizedData[type].packages.push(packageData);
            }
        })
    });

    //console.info(categorizedData, 'after adding packages');
    return categorizedData;
};

const PackagesList = (props) => {
    const classPackagesEmpty = isEmpty(props.perClassPackagesData);
    const monthlyPackagesEmpty = isEmpty(props.monthlyPackagesData);
    const enrollMentPackagesEmpty = isEmpty(props.enrollMentPackagesData);
    const schoolCurrency = props.currency;
    return (
        <Fragment>
            {!enrollMentPackagesEmpty && (
                <Wrapper>
                    <PackagesListContainer
                        listType="enrollmentPackages"
                        variant={props.variant}
                        packageProps={{
                            usedFor: props.usedFor,
                            appearance: props.appearance,
                            bgColor: props.bgColor,
                            variant: props.variant,
                            packageType: 'EP',
                            onAddToCartIconButtonClick: props.onAddToCartIconButtonClick,
                            schoolId: props.schoolId,
                            usedFor: props.usedFor
                        }}
                        packageListName="Enrollment Packages"
                        packagesData={props.enrollMentPackagesData}
                        schoolCurrency={schoolCurrency}
                        onSchoolEdit={props.onSchoolEdit}
                        onEditClick={() => {
                            props.onEditClick();
                        }}
                        setFormData={(packageData) => {
                            props.setFormData(packageData);
                        }}
                        onPriceEdit={props.onPriceEdit}
                    />
                </Wrapper>
            )}
            <Wrapper>
                {!classPackagesEmpty && (
                    <PackagesListContainer
                        listType="classPackages"
                        classPackages
                        variant={props.variant}
                        packageProps={{
                            usedFor: props.usedFor,
                            appearance: props.appearance,
                            bgColor: props.bgColor,
                            variant: props.variant,
                            packageType: 'CP',
                            onAddToCartIconButtonClick: props.onAddToCartIconButtonClick,
                            schoolId: props.schoolId,
                            usedFor: props.usedFor
                        }}
                        onAddToCartIconButtonClick={props.onAddToCartIconButtonClick}
                        fullScreen={monthlyPackagesEmpty}
                        packageListName="Per Class Packages"
                        packagesData={props.perClassPackagesData}
                        schoolCurrency={schoolCurrency}
                        onSchoolEdit={props.onSchoolEdit}
                        onEditClick={() => {
                            props.onEditClick();
                        }}
                        setFormData={(packageData) => {
                            props.setFormData(packageData);
                        }}
                        onPriceEdit={props.onPriceEdit}
                    />
                )}

                {!monthlyPackagesEmpty && (
                    <PackagesListContainer
                        listType="monthlyPackages"
                        variant={props.variant}
                        packageProps={{
                            usedFor: props.usedFor,
                            appearance: props.appearance,
                            bgColor: props.bgColor,
                            variant: props.variant,
                            packageType: 'MP',
                            onAddToCartIconButtonClick: props.onAddToCartIconButtonClick,
                            schoolId: props.schoolId,
                            usedFor: props.usedFor
                        }}
                        monthlyPackagesData={categorizeMonthlyListData(props.monthlyPackagesData)}
                        packageListName="Monthly Packages"
                        fullScreen={classPackagesEmpty}
                        packagesData={categorizeMonthlyListData(props.monthlyPackagesData)}
                        schoolCurrency={schoolCurrency}
                        onSchoolEdit={props.onSchoolEdit}
                        onEditClick={() => {
                            props.onEditClick();
                        }}
                        setFormData={(packageData) => {
                            props.setFormData(packageData);
                        }}
                        onPriceEdit={props.onPriceEdit}
                    />
                )}
            </Wrapper>
        </Fragment>
    );
};

//NOTE: usedFor defines in what situation we are using this package.
//Like using it for iframes, mysubscriptions etc.
PackagesList.propTypes = {
    perClassPackagesData: PropTypes.arrayOf(PackageStructure),
    monthlyPackagesData: PropTypes.arrayOf(PackageStructure),
    enrollMentPackages: PropTypes.bool,
    variant: PropTypes.string,
    schoolId: PropTypes.string,
    usedFor: PropTypes.string,
};

PackagesList.defaultProps = {
    enrollMentPackages: false,
    variant: 'normal',
    usedFor: 'default'
};

export default PackagesList;
