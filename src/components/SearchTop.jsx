import React from 'react';
import { Button } from 'antd';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import theme from '../theme'

function SearchTop({ content, ...extra }) {

  content = content.filter(item => item);
  const classes = makeStyles(() => ({
    SearchTop: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    SearchItem: {
      marginBottom: theme.ySpace.searchGroup,
      display: 'flex',
      alignItems: 'center'
    },
    searchLabel: {
      padding: '0 5px',
      marginLeft: 5,
      textAlign: 'center'
    },
    Btn: {
      marginLeft: theme.xSpace.btn,
      marginBottom: theme.ySpace.searchGroup,
    },
    Custom: {}
  }))();

  return (<div className={classes.SearchTop} {...extra}>
    {content.map((item, index) => {
      const { node, label, key: defaultKey, info, ...extra } = item;
      let key = defaultKey || index;
      let result;
      switch (node) {
        case 'SearchItem':
          result = (<div className={classes.SearchItem} key={key} {...extra} >
            <div className={classes.searchLabel}>{label}</div>
            <div className={classes.searchInput}>{item.info}</div>
          </div>)
          break;
        case 'Btn':
          result = (<Button type="primary" className={classes.Btn} key={key} {...extra} children={label} />)
          break;
        case 'Custom':
          result = <div key={key} className={classes.Custom} children={info} />
          break;
        default:
          break;
      }
      return result
    })}
  </div>)
}

SearchTop.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.string.isRequired
  })),
}
SearchTop.defaultProps = {
  content: []
}

export default SearchTop;

