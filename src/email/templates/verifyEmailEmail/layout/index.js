import React from 'react';

/**
 * Uses React to create an email verification HTML string
 * @param {*} data
 */
function verifyEmailEmail(data) {
    return (
        React.createElement(
            'div',
            { className: 'email-container', data },

            // Title and subtitle
            React.createElement('div', { className: 'title' }, 'Verify your email!'),
            React.createElement('div', { className: 'subtitle' }, 'D-Planner, the future of course election'),

            // Description
            React.createElement('div', { className: 'body' }, 'If you didn’t request to verify your email, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!'),

            // Link
            React.createElement('a', { className: 'click-link', href: data.link }, 'Verify Email!'),

            // Copyright
            React.createElement('div', { className: 'copyright' }, 'D-Planner, ©2020'),
        )
    );
}

export default verifyEmailEmail;
