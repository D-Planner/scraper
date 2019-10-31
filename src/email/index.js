import dotenv from 'dotenv';
import { transporter } from '../server';
// import { verificationEmail } from './templates/verification';

dotenv.config({ silent: true });

export function sendEmail(to, subject, html) {
    transporter.sendMail({
        from: process.env.GMAIL_ADDR,
        to,
        subject,
        html,
    }, (err, info) => {

    });
}

export const generateVerificationEmail = (name) => {
    return (
        `<html>
      <div>
        <div class="title">Verify your email!</div>
        <div class="subtitle">D-Planner, the future of course election</div>
        <p>Hello, ${name}! If you didn’t request a password reset, please delete this email and nothing will happen. Otherwise, click the link below to verify that you own this email address!</p>
        <button type="button" id="verify">
          <!-- Verify your email here! -->
          <div>Test Color</div>
          <!-- <div class="button-cover"><div class="button-text">Sign In</div></div> -->
        </button>
        <p>D-Planner, ©2019</p>
      </div>
    
      <script type="text/javascript">
        document.getElementById("verify").onclick = function () {
          window.location.href = "http://www.d-planner.com";
        };
      </script>
    
      <style>
        @import url('https://fonts.googleapis.com/css?family=Poppins|Roboto');
    
        html {
          font-family: 'Poppins', sans-serif;
          width: 900px;
          margin: 16px auto;
        }
    
        .title {
          font-style: normal;
          font-weight: bold;
          font-size: 48px;
          color:#574966;
        }
    
        .subtitle {
          font-style: normal;
          font-weight: bold;
          font-size: 30px;
          color:#574966;
        }
    
        #verify {
          display: flex;
          justify-content: center;
          align-items: center;
    
          border-radius: 20px;
          margin: 2px;
          color: red;
    
          width: 40%;
          height: 36px;

          display: flex;
          justify-content: center;
          align-items: center;
    
          background: none;
          /* background: linear-gradient(215.91deg, #518FF5 -11.34%, rgba(255, 255, 255, 0) 81.43%), #733DF9 !important; */
          /* background-clip: text; */
          -webkit-text-fill-color: transparent;
    
          font-weight: bold;
          font-size: 16px;
          text-transform: uppercase;
    /* 
          .button-cover {
              background: $white;
              .button-text {
                  width: calc(#{$button-width} - #{$virtual-border} - #{$virtual-border});
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: $gradient;
                  background-clip: text;
                  -webkit-text-fill-color: transparent;
                  height: calc(#{$button-height} - #{$virtual-border} - #{$virtual-border});
                  font-weight: bold;
                  font-size: 16px;
                  text-transform: uppercase;
              }
          }
          background: $gradient;
          border-radius: $button-border-radius;
          border: 1px solid $gradient; */
        }
      </style>
    </html>`
    );
};

