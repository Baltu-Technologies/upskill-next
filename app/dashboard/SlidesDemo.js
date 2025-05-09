import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Spinner } from "reactstrap";
import SlidesPresentation from "components/SlidesPresentation/SlidesPresentation";
import SlidesService from "services/slides.service";

// Import background images for fallback
import bg1 from "assets/img/bg1.jpg";
import bg3 from "assets/img/bg3.jpg";
import bg5 from "assets/img/bg5.jpg";

const SlidesDemo = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback slides in case API fails
  const fallbackSlides = [
    {
      title: "Welcome to Our Presentation",
      description: "This is a sample slide presentation built with React",
      image: bg1
    },
    {
      title: "Second Slide",
      description: "You can add as many slides as you want with different content",
      image: bg3
    },
    {
      title: "Third Slide",
      description: "Each slide can have its own title, description, and image",
      image: bg5
    }
  ];

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const data2 = await SlidesService.getTestData();
      console.log(data2);

      const data = await SlidesService.getAllSlides();
      setSlides(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching slides:', err);
      setError('Failed to load slides. Using fallback data.');
      setSlides(fallbackSlides);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="text-center">
          <Spinner color="primary" />
          <p>Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Slides Presentation Demo</CardTitle>
                {error && (
                  <div className="text-warning">
                    <small>{error}</small>
                  </div>
                )}
              </CardHeader>
              <CardBody>
                <SlidesPresentation slides={slides} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SlidesDemo; 