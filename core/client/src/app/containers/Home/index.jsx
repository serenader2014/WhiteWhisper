import React from 'react';

export default function Home(props) {
    return <div>{props.childrens}</div>;
}
Home.propTypes = {
    childrens: React.PropTypes.object,
};
