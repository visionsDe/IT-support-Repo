import React from 'react';
import '../../pageErrorStyles.scss';
import errorImage from "../../commonAssets/images/error.svg";

export default function pageError(){


    return (
        <div className="errorPageWrapper">
            <div className="container">
                <div className='errorImage'>
                    <img alt="Error" title="Error" src={errorImage}></img>
                </div>
                <div className='errorText'>
                    <h1>Error</h1>
                    <p>This page does not exist or cannot be opened in a browser.</p>
                </div>
            </div>
        </div>
    );
}
