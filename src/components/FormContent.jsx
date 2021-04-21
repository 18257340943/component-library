import React from 'react';
import { Form } from 'antd';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

import theme from './theme';
import SearchTop from './SearchTop';


function FormContent({ content, formItemLayout, style, ...extra }) {
  content = content.filter(item => item);
  const classes = makeStyles(() => ({
    FormContent: {},
    Title: {
      fontSize: '20px',
      marginBottom: theme.ySpace.title
    },
    TextItem: {
      marginBottom: theme.ySpace.text
    },
    FormItem: {
      marginBottom: '12px'
    },
    Custom: {}
  }))();

  return (<div className={classes.FormContent}>
    <Form {...formItemLayout} labelAlign="left" style={style} {...extra} >
      {
        content.map(item => {
          const { key, label, info, node, requireUi = false, ...extraNodeProps } = item;
          let actNode = null;
          switch (node) {
            case "Title":
            case "title":
              actNode = (<h4 className={classes.Title} key={key}>
                {label}
              </h4>)
              break;
            case "TextItem":
              actNode = (<Form.Item className={classes.TextItem} label={label} key={key} {...extraNodeProps}  >
                {info}
              </Form.Item>);
              break;
            case "FormItem":
              actNode = (<Form.Item className={requireUi ? `${classes.FormItem} required-item` : classes.FormItem} label={label} key={key}  {...extraNodeProps}>
                {item.info}
              </Form.Item>);
              break;
            case "SearchTop":
              actNode = (<SearchTop key={key} content={info} {...extraNodeProps} />);
              break;
            case "Custom":
              actNode = (<div key={key} className={classes.Custom} {...extraNodeProps}>
                {info}
              </div>);
              break;
            default:
              actNode = (<h4 key={key} {...extraNodeProps}>
                {label}
              </h4>);
              break;
          }
          return actNode
        })
      }
    </Form>
  </div>)
}

FormContent.propTypes = {
  style: PropTypes.object,
  content: PropTypes.array.isRequired,
  formItemLayout: PropTypes.shape({
    wrapperCol: PropTypes.object.isRequired,
    labelCol: PropTypes.object.isRequired
  })
}
FormContent.defaultProps = {
  style: {
    width: '100%'
  },
  formItemLayout: {
    wrapperCol: { span: 16 },
    labelCol: { span: 2 }
  }
}


export default FormContent