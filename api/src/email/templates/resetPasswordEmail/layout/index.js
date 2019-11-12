import React from 'react';

function resetPasswordEmail(data) {
    console.log('data', data);
    return (
        React.createElement(
            'div',
            { className: 'reset-password-email-container', data },
            // 'This is a test!',
            // `${data}`,

            // Title and subtitle
            React.createElement('div', { className: 'title' }, 'Verify your email!'),
            React.createElement('div', { className: 'subtitle' }, 'D-Planner, the future of course election'),

            // Description
            React.createElement('div', { className: 'body' }, 'If you didn\'t request a password reset, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!'),

            // Button
            React.createElement('a', { className: 'click-link', href: data.link }, 'Verify Email!'),
            // <a href="http://google.com" class="button">Go to Google</a>
            // React.createElement(
            //     'button',
            //     {
            //         onclick: () => { console.log('button clicked'); },
            //     },
            //     'test button',
            // ),

            // Copyright
            React.createElement('div', { className: 'copyright' }, 'D-Planner, ©2019'),
        )
    );
}

export default resetPasswordEmail;
