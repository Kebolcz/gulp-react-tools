var Child = require('./Child.js');
const Parent = () => (
	<div>
		<div>This is the parent.</div>
		<Child name="child" />
	</div>
);


module.exports = Parent;