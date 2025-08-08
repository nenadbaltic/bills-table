import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

type FavoriteButtonProps = {
  isFavorite: boolean;
  onToggle: () => void;
};

const FavoriteButton = ({ isFavorite, onToggle }: FavoriteButtonProps) => {
  return (
    <IconButton onClick={onToggle} aria-label="toggle favorite">
      {isFavorite ? (
        <FavoriteIcon data-testid="FavoriteIcon" color="error" />
      ) : (
        <FavoriteBorderIcon data-testid="FavoriteBorderIcon" />
      )}
    </IconButton>
  );
};

export default FavoriteButton;
