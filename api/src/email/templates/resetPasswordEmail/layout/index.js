import React from 'react';

/**
 * Uses React to create a password reset HTML string
 * @param {*} data
 */
function resetPasswordEmail(data) {
    return (
        React.createElement(
            'div',
            { className: 'email-container', data },

            // Title and subtitle
            React.createElement('div', { className: 'title' }, 'Reset your password!'),
            React.createElement('div', { className: 'subtitle' }, 'D-Planner, the future of course election'),

            // Description
            React.createElement('div', { className: 'body' }, 'If you didn\'t request a password reset, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!'),

            // Link
            React.createElement('a', { className: 'click-link', href: data.link }, 'Reset Password!'),

            // Copyright
            React.createElement('div', { className: 'copyright' }, 'D-Planner, ©2020'),
        )
    );
}

export default resetPasswordEmail;
