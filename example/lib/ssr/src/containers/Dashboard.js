import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useComponentWillMount } from "../lib/hooks";
import counterDucks from "../reducers/counter";
const { addCount, removeCount, addCountFromServer } = counterDucks.creators;
export default () => {
    const dispatch = useDispatch();
    const count = useSelector(({ counter: { count } }) => count);
    useComponentWillMount(() => {
        dispatch(addCountFromServer());
    });
    return (React.createElement("div", { "data-testid": 'counter' },
        React.createElement("h1", null, "Counter"),
        React.createElement("h2", null, count),
        React.createElement("button", { onClick: () => dispatch(addCount()) }, "Add"),
        React.createElement("button", { onClick: () => dispatch(removeCount()) }, "remove"),
        React.createElement("button", { onClick: () => dispatch(addCountFromServer(true)) }, "Add 5 From Server")));
};
