import { Button } from '@moudrodne/ui';
import { useGetHello } from '../../api/generated/reactQueries/default';

export const Home = () => {
  const { data, refetch } = useGetHello();

  return (
    <div>
      <Button
        variant="destructive"
        onClick={() => refetch()}
      >
        Test
      </Button>
      <div>{data as unknown as string}</div>
    </div>
  );
};
