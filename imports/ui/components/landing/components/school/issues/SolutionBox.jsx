import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

import Events from '/imports/util/events';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton.jsx';
import SchoolSolutionCard from '/imports/ui/components/landing/components/cards/SchoolSolutionCard.jsx';
import SchoolSolutionSlider from '/imports/ui/components/landing/components/school/issues/SchoolCardsSlider.jsx';
import ContactUsDialogBox from '/imports/ui/components/landing/components/dialogs/ContactUsDialogBox.jsx';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const BoxWrapper = styled.div`
	${helpers.flexCenter} flex-direction: column;
	flex-grow: 1;
	justify-content: space-evenly;
	max-width: ${helpers.schoolPageContainer + 200}px;
	width: 100%;
	margin: 0 auto;
	height: 100%;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	position: relative;

	@media screen and (max-width: ${helpers.mobile}px) {
		max-width: 500px;
	}

	@media screen and (max-width: ${helpers.tablet}px) {
		justify-content: center;
	}
`;

const BoxInnerWrapper = styled.div`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv * 2}px;
  justify-content: space-around;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column-reverse;
    // padding: 0 ${helpers.rhythmDiv * 2}px;
    padding: 0;
  }
`;

CardsListInner = styled.div`
	${helpers.flexCenter} flex-direction: column;
	width: 100%;
	justify-content: flex-start;
`;

CardsList = styled.div`
	max-width: 500px;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	margin-top: ${helpers.rhythmDiv * 2}px;
	flex-shrink: 1;
`;

const SolutionContentWrapper = styled.div`
	${helpers.flexCenter};
	flex-direction: column;
	padding: 0 ${helpers.rhythmDiv * 2}px;
	flex-shrink: 1;
	position: relative;
	margin: 0;

	@media screen and (max-width: ${helpers.tablet}px) {
		justify-content: flex-start;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		display: none;
	}
`;

const SolutionContent = styled.div`
  width: 500px;
  height: 300px;
  background-image: url('${(props) => props.solutionContent}');
  background-size: cover;
  background-position: 50% 50%;
`;

const Problem = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin: ${helpers.rhythmDiv * 4}px 0;

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-top: 0;
		margin: ${helpers.rhythmDiv * 2}px 0;
	}
`;

const MyProblemWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

// const ProblemNumber = styled.p`
//   margin: 0;
//   color: ${helpers.danger};
//   font-size: 28px;
//   font-family: ${helpers.specialFont};
//   line-height: 1;
// `;

const ProblemTitle = styled.h2`
	margin: 0;
	color: ${helpers.black};
	font-size: 40px;
	font-family: ${helpers.specialFont};
	font-weight: 600;
	line-height: 1;
	text-align: center;

	@media screen and (max-width: ${helpers.tablet + 100}px) {
		font-size: 32px;
	}
`;

const TOTAL_NUMBER_OF_SOLUTIONS = 3;

let myPosition = {
	initX: 0,
	initY: 0,
	currentX: 0,
	currentY: 0
};

const TOUCH_MOVE_THRESHOLD = 40;

class SolutionBox extends Component {
	state = {
		currentSolution: 0,
		showArrows: false,
		showCards: true
	};

	handleDialogBoxState = (dialogBoxName, state) => {
		this.setState({
			[dialogBoxName]: state
		});
	};

	handleSignUpButtonClick = () => {
		Events.trigger('registerAsSchool', { userType: 'School' });
	};

	_getNextSolution = (direction) => {
		let nextSolution = this.state.currentSolution;

		if (direction === 'left') {
			if (nextSolution === 0) {
				nextSolution = TOTAL_NUMBER_OF_SOLUTIONS;
			} else {
				nextSolution = --nextSolution;
			}
		} else {
			nextSolution = ++nextSolution % (TOTAL_NUMBER_OF_SOLUTIONS + 1);
		}

		return nextSolution;
	};

	_moveToSolution = (direction) => {
		// get next solution with given direction.
		const nextSolution = this._getNextSolution(direction);

		//debugger;
		this.handleSolutionChange(nextSolution);
	};

	handleArrowClick = (arrow) => {
		this._moveToSolution(arrow);
	};

	handleSolutionChange = (currentSolution) => {
		this.setState({ currentSolution });
	};

	handleScreenResize = () => {
		if (window.innerWidth <= helpers.tablet) {
			if (this.state.showCards) this.setState({ showCards: false });
		} else {
			if (!this.state.showCards) this.setState({ showCards: true });
		}
	};

	handleMouseEvent = (state) => {
		this.setState({
			showArrows: state
		});
	};

	handleTouchStart = (e) => {
		this.touchStarted = true;
		myPosition.initX = e.touches[0].clientX;
	};

	handleTouchMove = (e) => {
		myPosition.currentX = e.touches[0].clientX;
	};

	_resetTouchEventData = () => {
		this.touchStarted = this.touchMoved = false;
		myPosition.initX = myPosition.initY = myPosition.currentX = myPosition.currentY = 0;
	};

	handleTouchCancel = (e) => {
		this._resetTouchEventData();
	};

	handleTouchEnd = (e) => {
		if (Math.abs(myPosition.currentX - myPosition.initX) > TOUCH_MOVE_THRESHOLD) {
			if (myPosition.initX < myPosition.currentX) {
				this._moveToSolution('right');
			} else {
				this._moveToSolution('left');
			}
		}
		this._resetTouchEventData();
	};

	componentWillMount = () => {
		window.addEventListener('resize', this.handleScreenResize);
	};

	componentDidMount = () => {
		this.handleScreenResize();
	};

	componentWillUnMount = () => {
		window.removeEventListener('resize', this.handleScreenResize);
	};

	render() {
		const { props } = this;
		return (
			<BoxWrapper firstBox={props.firstBox}>
				{this.state.contactDialog && (
					<ContactUsDialogBox
						open={this.state.contactDialog}
						onModalClose={() => this.handleDialogBoxState('contactDialog', false)}
					/>
				)}
				<Problem>
					<MyProblemWrapper>
						{/*<ProblemNumber>Problem #{props.solutionIndex}</ProblemNumber> */}
						<ProblemTitle>{props.title}</ProblemTitle>
					</MyProblemWrapper>
				</Problem>

				<BoxInnerWrapper>
					<CardsList>
						<CardsListInner>
							{props.cardsData &&
								props.cardsData.map((card, i) => (
									<SchoolSolutionCard
										key={i}
										{...card}
										active={i === this.state.currentSolution}
										noMarginBotton={i === 2 || i === 3}
										onCardClick={() => this.handleSolutionChange(i)}
										cardBgColor={props.cardBgColor}
									/>
								))}
						</CardsListInner>
					</CardsList>

					<SolutionContentWrapper
						onMouseOver={() => this.handleMouseEvent(true)}
						onMouseOut={() => this.handleMouseEvent(false)}
					>
						{props.cardsData &&
							props.cardsData.map((card, i) => {
								const isCurrentSolutionSelected = this.state.currentSolution === i;
								return (
									<CSSTransition
										in={isCurrentSolutionSelected}
										timeout={{
											enter: 600,
											exit: 400
										}}
										classNames="fade"
										unmountOnExit
									>
										<SolutionContent key={i} solutionContent={card.solutionContent} />
									</CSSTransition>
								);
							})}
					</SolutionContentWrapper>
				</BoxInnerWrapper>
			</BoxWrapper>
		);
	}
}

SolutionBox.propTypes = {
	content: PropTypes.string,
	active: PropTypes.bool,
	onActionButtonClick: PropTypes.func
};

export default SolutionBox;
