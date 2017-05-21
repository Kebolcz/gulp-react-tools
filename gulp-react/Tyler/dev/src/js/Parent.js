var Parent = React.createClass({
    render: function(){
        return (
            <div>
                <div>This is the parent.</div>
                <child name="child" />
            </div>
        )
    }
});