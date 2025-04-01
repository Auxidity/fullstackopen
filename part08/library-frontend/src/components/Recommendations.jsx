import { useLazyQuery, useQuery } from "@apollo/client";
import { USER, FILTERED_BOOKS } from "./queries";
import { useEffect, useState } from "react";

const Recommendation = (props) => {
    const [favoriteGenre, setFavoriteGenre] = useState(null)

    if (!props.show) {
        return null;
    }

    const { loading: userLoading, data: userData } = useQuery(USER);

    useEffect(() => {
        if (userData) {
            setFavoriteGenre(userData.me.favoriteGenre)
            refetch()
        }
    }, [userData])

    const [, { loading: bookLoading, data: bookData, refetch }] = useLazyQuery(FILTERED_BOOKS, {
        variables: { genre: favoriteGenre },
    });

    const filteredRecommendation = bookData?.allBooks || []

    const isLoading = userLoading || bookLoading

    return (
        <div>
            <h2>Recommendations</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                filteredRecommendation.length > 0 ? (
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>author</th>
                                <th>published</th>
                            </tr>
                            {filteredRecommendation.map((a) => (
                                <tr key={a.title}>
                                    <td>{a.title}</td>
                                    <td>{a.author.name}</td>
                                    <td>{a.published}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>) : (
                    <div>No recommendations available for your favorite genre.</div>
                )
            )}
        </div>
    );
};

export default Recommendation;
