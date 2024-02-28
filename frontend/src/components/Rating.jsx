import React from 'react';

const Rating = (props) => {
  const { rating, numReviews } = props;
  let newRating = rating;

  return (
    <div className="rating">
      {(() => {
        const arr = [];
        for (let i = 0; i < 5; i++) {
          arr.push(
            <span key={i}>
              <i
                className={
                  newRating >= 1
                    ? 'fas fa-star'
                    : newRating >= 0.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
                }
              />
            </span>
          );
          newRating--;
        }
        return arr;
      })()}
      <span> {numReviews} reviews</span>
    </div>
  );
};

export default Rating;
