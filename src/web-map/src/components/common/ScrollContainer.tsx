import React from "react"

export default class ScrollContainer extends React.Component<any> {
    render() {
        return <div className="maputnik-scroll-container">
            {this.props.children}
        </div>
    }
}