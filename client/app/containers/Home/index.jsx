import React from 'react';

export default function Home(props) {
    return <div>{props.children}</div>;
}
Home.propTypes = {
    children: React.PropTypes.object,
};
