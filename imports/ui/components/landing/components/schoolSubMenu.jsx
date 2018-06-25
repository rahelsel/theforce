import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isArray, size } from "lodash";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import Icon from "material-ui/Icon";

import NestedNavItems from "./NestedNavItems";

class SchoolSubMenu extends React.Component {
  state = { open: false };

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { data, classes } = this.props;
    const role = _.indexOf(Meteor.user().roles, "Superadmin");
    {
      console.log("Meteor.user() of schoolsubmenu", Meteor.user().roles);
    }
    return (
      <Fragment>
        {role != -1 && (
          <div>
            {size(data) < 6 ? (
              data.map((school, index) => {
                return (
                  <NestedNavItems
                    key={`${school.name}-${index}`}
                    button
                    name={school.name}
                    nameLimit={22}
                    classes={classes}
                    iconName="school"
                    childData={[
                      {
                        name: "Home Page",
                        link: school.link,
                        iconName: "home"
                      },
                      {
                        name: "Edit",
                        link: school.schoolEditLink,
                        iconName: "mode_edit"
                      },
                      {
                        name: "Members",
                        link: `${school.link}/members`,
                        iconName: "people"
                      },
                      {
                        name: "Financials",
                        link: `${school.link}/financials`,
                        iconName: "attach_money"
                      }
                    ]}
                    onClick={this.props.onClick}
                  />
                );
              })
            ) : (
              <Fragment>
                <ListItem onClick={this.handleClick}>
                  <ListItemIcon>
                    <Icon>dashboard</Icon>
                  </ListItemIcon>
                  <ListItemText
                    classes={{ text: classes.menuListItemText }}
                    primary={"School You Manage"}
                  />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  component="li"
                  in={this.state.open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List className={classes.nestedLevel2} disablePadding>
                    {data.map((school, index) => {
                      return (
                        <NestedNavItems
                          key={`${school.name}-${index}`}
                          button
                          name={school.name}
                          nameLimit={13}
                          iconName="school"
                          classes={classes}
                          childData={[
                            {
                              name: "Home Page",
                              link: school.link,
                              iconName: "home"
                            },
                            {
                              name: "Edit",
                              link: school.schoolEditLink,
                              iconName: "mode_edit"
                            },
                            {
                              name: "Members",
                              link: `${school.link}/members`,
                              iconName: "people"
                            },
                            {
                              name: "Financials",
                              link: `${school.link}/financials`,
                              iconName: "attach_money"
                            }
                          ]}
                          onClick={this.props.onClick}
                        />
                      );
                    })}
                  </List>
                </Collapse>
              </Fragment>
            )}
          </div>
        )}
        {role == -1 && (
          <div>
            {size(data) < 6 ? (
              data.map((school, index) => {
                return (
                  <NestedNavItems
                    key={`${school.name}-${index}`}
                    button
                    name={school.name}
                    nameLimit={22}
                    classes={classes}
                    iconName="school"
                    childData={[
                      {
                        name: "Home Page",
                        link: school.link,
                        iconName: "home"
                      },
                      {
                        name: "Edit",
                        link: school.schoolEditLink,
                        iconName: "mode_edit"
                      },
                      {
                        name: "Members",
                        link: `${school.link}/members`,
                        iconName: "people"
                      }
                    ]}
                    onClick={this.props.onClick}
                  />
                );
              })
            ) : (
              <Fragment>
                <ListItem onClick={this.handleClick}>
                  <ListItemIcon>
                    <Icon>dashboard</Icon>
                  </ListItemIcon>
                  <ListItemText
                    classes={{ text: classes.menuListItemText }}
                    primary={"School You Manage"}
                  />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  component="li"
                  in={this.state.open}
                  timeout="auto"
                  unmountOnExit
                >
                  <List className={classes.nestedLevel2} disablePadding>
                    {data.map((school, index) => {
                      return (
                        <NestedNavItems
                          key={`${school.name}-${index}`}
                          button
                          name={school.name}
                          nameLimit={13}
                          iconName="school"
                          classes={classes}
                          childData={[
                            {
                              name: "Home Page",
                              link: school.link,
                              iconName: "home"
                            },
                            {
                              name: "Edit",
                              link: school.schoolEditLink,
                              iconName: "mode_edit"
                            },
                            {
                              name: "Members",
                              link: `${school.link}/members`,
                              iconName: "people"
                            }
                          ]}
                          onClick={this.props.onClick}
                        />
                      );
                    })}
                  </List>
                </Collapse>
              </Fragment>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

export default SchoolSubMenu;
