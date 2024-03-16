import PropTypes from "prop-types";

const Option = ({ children, ...props }) => {
  return (
    <option {...props} className="checked:bg-green-500 checked:text-white ">
      {children}
    </option>
  );
};

// proptypes
Option.propTypes = {
  children: PropTypes.node,
  props: PropTypes.object,
};

export default Option;
