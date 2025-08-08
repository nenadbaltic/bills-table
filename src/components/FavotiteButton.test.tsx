import { render, screen } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';

describe('FavoriteButton', () => {
  it('renders filled heart when isFavorite is true', () => {
    render(<FavoriteButton isFavorite={true} onToggle={() => {}} />);
    expect(screen.getByLabelText(/toggle favorite/i)).toBeInTheDocument();
    expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument();
  });

  it('renders empty heart when isFavorite is false', () => {
    render(<FavoriteButton isFavorite={false} onToggle={() => {}} />);
    expect(screen.getByLabelText(/toggle favorite/i)).toBeInTheDocument();
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument();
  });
});
